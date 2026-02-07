<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Setting;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class SettingController extends Controller
{
    public function index(): JsonResponse
    {
        $settings = Setting::all()->groupBy('group');

        return response()->json([
            'success' => true,
            'data' => $settings,
        ]);
    }

    public function update(Request $request): JsonResponse
    {
        $request->validate([
            'settings' => 'required|array',
            'settings.*.key' => 'required|string',
            'settings.*.value' => 'nullable|string',
        ]);

        $userId = $request->user()->id;

        foreach ($request->settings as $setting) {
            Setting::set($setting['key'], $setting['value'], $userId);
        }

        return response()->json([
            'success' => true,
            'message' => 'Settings updated successfully.',
        ]);
    }

    public function show(string $key): JsonResponse
    {
        $setting = Setting::where('key', $key)->firstOrFail();

        return response()->json([
            'success' => true,
            'data' => $setting,
        ]);
    }
}
