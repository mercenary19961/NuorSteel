<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Models\Product;
use Inertia\Inertia;
use Inertia\Response;

class ProductController extends Controller
{
    public function index(): Response
    {
        $products = Product::active()
            ->ordered()
            ->with('featuredImage')
            ->get()
            ->map(fn($product) => [
                'id' => $product->id,
                'name' => $product->name,
                'slug' => $product->slug,
                'short_description' => $product->short_description,
                'category' => $product->category,
                'image' => $product->featuredImage?->url,
            ]);

        return Inertia::render('Public/Products', [
            'products' => $products,
        ]);
    }

    public function show(string $slug): Response
    {
        $product = Product::where('slug', $slug)
            ->active()
            ->with(['featuredImage', 'images.media', 'specifications'])
            ->firstOrFail();

        return Inertia::render('Public/ProductDetail', [
            'product' => [
                'id' => $product->id,
                'name' => $product->name,
                'name_en' => $product->name_en,
                'name_ar' => $product->name_ar,
                'slug' => $product->slug,
                'short_description' => $product->short_description,
                'description' => $product->description,
                'category' => $product->category,
                'featured_image' => $product->featuredImage?->url,
                'images' => $product->images->map(fn($img) => [
                    'id' => $img->id,
                    'url' => $img->url,
                    'alt' => $img->alt_text,
                    'is_primary' => $img->is_primary,
                ]),
                'specifications' => [
                    'chemical' => $product->getChemicalSpecifications()->map(fn($s) => [
                        'property' => $s->property,
                        'value' => $s->display_value,
                    ]),
                    'mechanical' => $product->getMechanicalSpecifications()->map(fn($s) => [
                        'property' => $s->property,
                        'value' => $s->display_value,
                    ]),
                    'dimensional' => $product->getDimensionalSpecifications()->map(fn($s) => [
                        'property' => $s->property,
                        'value' => $s->display_value,
                    ]),
                ],
            ],
        ]);
    }
}
