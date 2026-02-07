<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\ProductImage;
use App\Models\ProductSpecification;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class ProductController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = Product::with('featuredImage');

        if ($request->has('category')) {
            $query->where('category', $request->category);
        }

        if ($request->has('active')) {
            $query->where('is_active', $request->boolean('active'));
        }

        $products = $query->ordered()->paginate(15);

        return response()->json([
            'success' => true,
            'data' => $products->items(),
            'meta' => [
                'current_page' => $products->currentPage(),
                'last_page' => $products->lastPage(),
                'per_page' => $products->perPage(),
                'total' => $products->total(),
            ],
        ]);
    }

    public function store(Request $request): JsonResponse
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

        $product = Product::create($data);

        return response()->json([
            'success' => true,
            'message' => 'Product created successfully.',
            'data' => $product,
        ], 201);
    }

    public function show(int $id): JsonResponse
    {
        $product = Product::with(['featuredImage', 'images.media', 'specifications'])
            ->findOrFail($id);

        return response()->json([
            'success' => true,
            'data' => $product,
        ]);
    }

    public function update(Request $request, int $id): JsonResponse
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

        $data = $request->only([
            'name_en', 'name_ar', 'slug', 'short_description_en', 'short_description_ar',
            'description_en', 'description_ar', 'category', 'featured_image_id',
            'is_active', 'is_featured', 'sort_order',
        ]);
        $data['updated_by'] = $request->user()->id;

        $product->update($data);

        return response()->json([
            'success' => true,
            'message' => 'Product updated successfully.',
            'data' => $product,
        ]);
    }

    public function destroy(int $id): JsonResponse
    {
        $product = Product::findOrFail($id);
        $product->delete();

        return response()->json([
            'success' => true,
            'message' => 'Product deleted successfully.',
        ]);
    }

    public function addImage(Request $request, int $id): JsonResponse
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

        $image = ProductImage::create([
            'product_id' => $id,
            'media_id' => $request->media_id,
            'is_primary' => $request->boolean('is_primary'),
            'sort_order' => $request->input('sort_order', 0),
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Image added successfully.',
            'data' => $image->load('media'),
        ], 201);
    }

    public function removeImage(int $id, int $imageId): JsonResponse
    {
        $image = ProductImage::where('product_id', $id)
            ->where('id', $imageId)
            ->firstOrFail();

        $image->delete();

        return response()->json([
            'success' => true,
            'message' => 'Image removed successfully.',
        ]);
    }

    public function updateSpecifications(Request $request, int $id): JsonResponse
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

        return response()->json([
            'success' => true,
            'message' => 'Specifications updated successfully.',
            'data' => $product->specifications()->get(),
        ]);
    }

    public function categories(): JsonResponse
    {
        $categories = Product::distinct()->whereNotNull('category')->pluck('category');

        return response()->json([
            'success' => true,
            'data' => $categories,
        ]);
    }
}
