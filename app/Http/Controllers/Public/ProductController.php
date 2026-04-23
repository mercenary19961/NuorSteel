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
            ->with(['featuredImage', 'images.media', 'specifications'])
            ->get()
            ->map(fn($product) => [
                'id' => $product->id,
                'name_en' => $product->name_en,
                'name_ar' => $product->name_ar,
                'slug' => $product->slug,
                'short_description_en' => $product->short_description_en,
                'short_description_ar' => $product->short_description_ar,
                'description_en' => $product->description_en,
                'description_ar' => $product->description_ar,
                'category' => $product->category,
                'image' => $product->featuredImage?->url,
                'highlights' => $product->highlights ?? [],
                'spec_icons' => $product->spec_icons ?? [],
                'spec_table' => $product->spec_table,
                'spec_table_2' => $product->spec_table_2,
                'features' => $product->features ?? [],
                'show_quote_tab' => $product->show_quote_tab,
                'images' => $product->images->map(fn($img) => [
                    'id' => $img->id,
                    'url' => $img->media?->url,
                    'alt' => $img->media?->alt_text_en ?? '',
                ]),
                'specifications' => [
                    'chemical' => $product->specifications
                        ->where('spec_type', 'chemical')
                        ->sortBy('sort_order')
                        ->values()
                        ->map(fn($s) => [
                            'property_en' => $s->property_en,
                            'property_ar' => $s->property_ar,
                            'value' => $s->display_value,
                        ]),
                    'mechanical' => $product->specifications
                        ->where('spec_type', 'mechanical')
                        ->sortBy('sort_order')
                        ->values()
                        ->map(fn($s) => [
                            'property_en' => $s->property_en,
                            'property_ar' => $s->property_ar,
                            'value' => $s->display_value,
                        ]),
                    'dimensional' => $product->specifications
                        ->where('spec_type', 'dimensional')
                        ->sortBy('sort_order')
                        ->values()
                        ->map(fn($s) => [
                            'property_en' => $s->property_en,
                            'property_ar' => $s->property_ar,
                            'value' => $s->display_value,
                        ]),
                ],
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
                'highlights' => $product->highlights ?? [],
                'spec_icons' => $product->spec_icons ?? [],
                'spec_table' => $product->spec_table,
                'spec_table_2' => $product->spec_table_2,
                'features' => $product->features ?? [],
                'show_quote_tab' => $product->show_quote_tab,
                'images' => $product->images->map(fn($img) => [
                    'id' => $img->id,
                    'url' => $img->url,
                    'alt' => $img->alt_text,
                    'is_primary' => $img->is_primary,
                ]),
                'specifications' => [
                    'chemical' => $product->specifications
                        ->where('spec_type', 'chemical')
                        ->sortBy('sort_order')
                        ->values()
                        ->map(fn($s) => [
                            'property' => $s->property,
                            'value' => $s->display_value,
                        ]),
                    'mechanical' => $product->specifications
                        ->where('spec_type', 'mechanical')
                        ->sortBy('sort_order')
                        ->values()
                        ->map(fn($s) => [
                            'property' => $s->property,
                            'value' => $s->display_value,
                        ]),
                    'dimensional' => $product->specifications
                        ->where('spec_type', 'dimensional')
                        ->sortBy('sort_order')
                        ->values()
                        ->map(fn($s) => [
                            'property' => $s->property,
                            'value' => $s->display_value,
                        ]),
                ],
            ],
        ]);
    }
}
