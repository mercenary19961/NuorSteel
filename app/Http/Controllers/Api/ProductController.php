<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Product;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    public function index(Request $request): JsonResponse
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

        return response()->json([
            'success' => true,
            'data' => $products,
        ]);
    }

    public function show(string $slug): JsonResponse
    {
        $product = Product::where('slug', $slug)
            ->active()
            ->with(['featuredImage', 'images.media', 'specifications'])
            ->firstOrFail();

        return response()->json([
            'success' => true,
            'data' => [
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
