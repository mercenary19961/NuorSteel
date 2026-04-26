<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        // Earlier seed migration set this to https://linkedin.com/company/nuorsteel
        // (broken slug — Nuor Steel's real LinkedIn handle is "nuor-steel" with a
        // hyphen). Footer uses this setting; homepage News section was hardcoded
        // to the correct URL, leaving the two out of sync.
        DB::table('settings')->updateOrInsert(
            ['key' => 'linkedin_url'],
            [
                'key' => 'linkedin_url',
                'value' => 'https://www.linkedin.com/company/nuor-steel/',
                'type' => 'url',
                'group' => 'contact',
            ],
        );
    }

    public function down(): void
    {
        // No-op: reverting to the broken value would be intentionally regressing.
    }
};
