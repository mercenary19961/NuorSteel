<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            // Stamped when an admin sends the user an invite email. Combined with
            // last_login_at IS NULL it tells us "this user hasn't accepted their
            // invite yet" — drives the "Pending invite" status pill in admin users list.
            $table->timestamp('invited_at')->nullable()->after('last_login_ip');
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn('invited_at');
        });
    }
};
