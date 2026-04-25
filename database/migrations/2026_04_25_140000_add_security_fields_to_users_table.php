<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            // Force-change-password gate: when an admin sets a new user's initial
            // password manually, we flag them so the next login is intercepted by
            // a "set your own password" screen.
            $table->boolean('must_change_password')->default(false)->after('is_active');
            // Tracked separately from updated_at so we can show "Last password change: N days ago"
            // and gate future policies (e.g. "rotate every 90 days") without false positives.
            $table->timestamp('password_changed_at')->nullable()->after('must_change_password');
            // Login audit — surfaced in admin users list for compromise detection.
            $table->timestamp('last_login_at')->nullable()->after('password_changed_at');
            $table->string('last_login_ip', 45)->nullable()->after('last_login_at');
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn([
                'must_change_password',
                'password_changed_at',
                'last_login_at',
                'last_login_ip',
            ]);
        });
    }
};
