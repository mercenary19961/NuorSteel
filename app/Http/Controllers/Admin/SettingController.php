<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Setting;
use App\Services\UndoService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class SettingController extends Controller
{
    public function __construct(
        protected UndoService $undoService,
    ) {}

    public function index(): Response
    {
        return Inertia::render('Admin/Settings', [
            'settings' => Setting::whereIn('group', ['contact', 'email', 'location'])->get()->groupBy('group'),
            'undoMeta' => $this->undoService->getUndoMeta('settings', 'all'),
        ]);
    }

    public function update(Request $request): RedirectResponse
    {
        $allowedKeys = [
            'company_phone', 'company_email', 'company_address_en', 'company_address_ar',
            'linkedin_url', 'contact_recipients', 'career_recipients',
            'google_maps_embed_url', 'google_maps_place_url',
        ];

        $request->validate([
            'settings' => 'required|array',
            'settings.*.key' => ['required', 'string', 'in:' . implode(',', $allowedKeys)],
            'settings.*.value' => 'nullable|string',
        ]);

        // Snapshot current state before applying changes
        $keys = collect($request->settings)->pluck('key')->all();
        $currentSettings = Setting::whereIn('key', $keys)->pluck('value', 'key');

        $oldData = [];
        $newData = [];
        foreach ($request->settings as $setting) {
            $oldData[$setting['key']] = (string) ($currentSettings[$setting['key']] ?? '');
            $newData[$setting['key']] = $setting['value'] ?? '';
        }

        $hasChanges = $this->undoService->saveState('settings', 'all', $oldData, $newData);

        if (!$hasChanges) {
            return redirect()->back()->with('success', 'No changes detected.');
        }

        // Apply changes
        $userId = $request->user()->id;
        foreach ($request->settings as $setting) {
            Setting::set($setting['key'], $setting['value'], $userId);
        }

        return redirect()->back()->with('success', 'Settings updated successfully.');
    }
}
