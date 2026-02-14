<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\ProductImage;
use App\Models\ProductSpecification;
use App\Services\UndoService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class ProductController extends Controller
{
    public function __construct(
        protected UndoService $undoService,
    ) {}
    public function index(Request $request): Response
    {
        $query = Product::with('featuredImage');

        if ($request->has('category')) {
            $query->where('category', $request->category);
        }

        if ($request->has('active')) {
            $query->where('is_active', $request->boolean('active'));
        }

        $products = $query->ordered()->paginate(15);
        $categories = Product::distinct()->whereNotNull('category')->pluck('category');

        $lastId = session('undo_product_last_id');
        $undoMeta = $lastId ? $this->undoService->getUndoMeta('product', $lastId) : null;

        return Inertia::render('Admin/Products/Index', [
            'products' => $products,
            'categories' => $categories,
            'filters' => $request->only(['category', 'active']),
            'undoMeta' => $undoMeta,
            'undoModelId' => $undoMeta ? (string) $lastId : null,
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Admin/Products/Form', [
            'item' => null,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'name_en' => 'required|string|max:255',
            'name_ar' => 'required|string|max:255',
            'slug' => 'nullable|string|max:255|unique:products,slug',
            'short_description_en' => 'nullable|string',
            'short_description_ar' => 'nullable|string',
            'description_en' => 'nullable|string',
            'description_ar' => 'nullable|string',
            'category' => 'nullable|string|max:100',
            'featured_image_id' => 'nullable|exists:media,id',
            'is_active' => 'boolean',
            'is_featured' => 'boolean',
            'sort_order' => 'integer',
        ]);

        $data = $request->only([
            'name_en', 'name_ar', 'slug', 'short_description_en', 'short_description_ar',
            'description_en', 'description_ar', 'category', 'featured_image_id',
            'is_active', 'is_featured', 'sort_order',
        ]);
        $data['slug'] = $data['slug'] ?? Str::slug($data['name_en']);
        $data['created_by'] = $request->user()->id;
        $data['updated_by'] = $request->user()->id;

        Product::create($data);

        return redirect()->route('admin.products.index')->with('success', 'Product created successfully.');
    }

    public function edit(int $id): Response
    {
        $product = Product::with(['featuredImage', 'images.media', 'specifications'])
            ->findOrFail($id);

        return Inertia::render('Admin/Products/Form', [
            'item' => $product,
            'undoMeta' => $this->undoService->getUndoMeta('product', $id),
        ]);
    }

    public function update(Request $request, int $id): RedirectResponse
    {
        $request->validate([
            'name_en' => 'required|string|max:255',
            'name_ar' => 'required|string|max:255',
            'slug' => 'nullable|string|max:255|unique:products,slug,' . $id,
            'short_description_en' => 'nullable|string',
            'short_description_ar' => 'nullable|string',
            'description_en' => 'nullable|string',
            'description_ar' => 'nullable|string',
            'category' => 'nullable|string|max:100',
            'featured_image_id' => 'nullable|exists:media,id',
            'is_active' => 'boolean',
            'is_featured' => 'boolean',
            'sort_order' => 'integer',
        ]);

        $product = Product::findOrFail($id);

        $trackedFields = [
            'name_en', 'name_ar', 'short_description_en', 'short_description_ar',
            'description_en', 'description_ar', 'category', 'featured_image_id',
            'is_active', 'is_featured', 'sort_order',
        ];

        $oldData = ['id' => $product->id];
        foreach ($trackedFields as $field) {
            $oldData[$field] = (string) ($product->$field ?? '');
        }

        $data = $request->only(array_merge($trackedFields, ['slug']));
        $data['updated_by'] = $request->user()->id;

        $newData = ['id' => $product->id];
        foreach ($trackedFields as $field) {
            $newData[$field] = (string) ($data[$field] ?? '');
        }

        $hasChanges = $this->undoService->saveState('product', $product->id, $oldData, $newData);

        if (!$hasChanges) {
            return redirect()->back()->with('success', 'No changes detected.');
        }

        $product->update($data);

        return redirect()->back()->with('success', 'Product updated successfully.');
    }

    public function destroy(int $id): RedirectResponse
    {
        $product = Product::findOrFail($id);

        $this->undoService->saveDeleteState('product', $product->id);
        session()->put('undo_product_last_id', $product->id);

        $product->delete();

        return redirect()->route('admin.products.index')->with('success', 'Product deleted successfully.');
    }

    public function addImage(Request $request, int $id): RedirectResponse
    {
        $request->validate([
            'media_id' => 'required|exists:media,id',
            'is_primary' => 'boolean',
            'sort_order' => 'integer',
        ]);

        $product = Product::findOrFail($id);

        if ($request->boolean('is_primary')) {
            $product->images()->update(['is_primary' => false]);
        }

        ProductImage::create([
            'product_id' => $id,
            'media_id' => $request->media_id,
            'is_primary' => $request->boolean('is_primary'),
            'sort_order' => $request->input('sort_order', 0),
        ]);

        return redirect()->back()->with('success', 'Image added successfully.');
    }

    public function removeImage(int $id, int $imageId): RedirectResponse
    {
        $image = ProductImage::where('product_id', $id)
            ->where('id', $imageId)
            ->firstOrFail();

        $image->delete();

        return redirect()->back()->with('success', 'Image removed successfully.');
    }

    public function updateSpecifications(Request $request, int $id): RedirectResponse
    {
        $request->validate([
            'specifications' => 'required|array',
            'specifications.*.property_en' => 'required|string|max:100',
            'specifications.*.property_ar' => 'required|string|max:100',
            'specifications.*.spec_type' => 'required|in:chemical,mechanical,dimensional',
            'specifications.*.min_value' => 'nullable|string|max:50',
            'specifications.*.max_value' => 'nullable|string|max:50',
            'specifications.*.value' => 'nullable|string|max:100',
            'specifications.*.unit' => 'nullable|string|max:20',
            'specifications.*.sort_order' => 'integer',
        ]);

        $product = Product::findOrFail($id);

        // Delete existing specifications
        $product->specifications()->delete();

        // Create new specifications
        foreach ($request->specifications as $index => $spec) {
            ProductSpecification::create([
                'product_id' => $id,
                'property_en' => $spec['property_en'],
                'property_ar' => $spec['property_ar'],
                'spec_type' => $spec['spec_type'],
                'min_value' => $spec['min_value'] ?? null,
                'max_value' => $spec['max_value'] ?? null,
                'value' => $spec['value'] ?? null,
                'unit' => $spec['unit'] ?? null,
                'sort_order' => $spec['sort_order'] ?? $index,
            ]);
        }

        return redirect()->back()->with('success', 'Specifications updated successfully.');
    }
}
