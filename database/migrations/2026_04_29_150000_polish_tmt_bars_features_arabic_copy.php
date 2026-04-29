<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        $this->rewriteTmtBarFeatures([
            'old_thermo_desc' => 'عملية TMT المتقدمة تضمن التوازن الأمثل بين القوة والمرونة من خلال التبريد المتحكم.',
            'new_thermo_desc' => 'عملية TMT المتقدمة تضمن التوازن الأمثل بين القوة والمرونة من خلال التبريد المحكم.',
            'old_corrosion_title' => 'مقاومة التآكل',
            'new_corrosion_title' => 'مقاومةُ التآكلِ:',
            'old_corrosion_desc' => 'طبقة مارتنسيت مقسّاة خارجية توفر مقاومة معززة للتدهور البيئي.',
            'new_corrosion_desc' => 'طبقةٌ خارجيةٌ من المارتنسيتِ المُقسّى توفّرُ مقاومةً مُعزَّزةً للتدهورِ البيئيّ.',
        ]);
    }

    public function down(): void
    {
        $this->rewriteTmtBarFeatures([
            'old_thermo_desc' => 'عملية TMT المتقدمة تضمن التوازن الأمثل بين القوة والمرونة من خلال التبريد المحكم.',
            'new_thermo_desc' => 'عملية TMT المتقدمة تضمن التوازن الأمثل بين القوة والمرونة من خلال التبريد المتحكم.',
            'old_corrosion_title' => 'مقاومةُ التآكلِ:',
            'new_corrosion_title' => 'مقاومة التآكل',
            'old_corrosion_desc' => 'طبقةٌ خارجيةٌ من المارتنسيتِ المُقسّى توفّرُ مقاومةً مُعزَّزةً للتدهورِ البيئيّ.',
            'new_corrosion_desc' => 'طبقة مارتنسيت مقسّاة خارجية توفر مقاومة معززة للتدهور البيئي.',
        ]);
    }

    /**
     * Read tmt-bars.features JSON, swap specific Arabic strings, write it back.
     * Done in PHP rather than SQL JSON_REPLACE so any other admin edits to
     * unrelated feature entries are preserved.
     */
    private function rewriteTmtBarFeatures(array $swap): void
    {
        $row = DB::table('products')->where('slug', 'tmt-bars')->first();
        if (!$row || !$row->features) {
            return;
        }

        $features = json_decode($row->features, true);
        if (!is_array($features)) {
            return;
        }

        $changed = false;
        foreach ($features as &$feature) {
            if (!isset($feature['title_ar'], $feature['description_ar'])) {
                continue;
            }
            // Thermo-mechanical treatment: only the description changed
            if (($feature['description_ar'] ?? null) === $swap['old_thermo_desc']) {
                $feature['description_ar'] = $swap['new_thermo_desc'];
                $changed = true;
            }
            // Corrosion resistance: title + description both changed
            if (($feature['title_ar'] ?? null) === $swap['old_corrosion_title']) {
                $feature['title_ar'] = $swap['new_corrosion_title'];
                $changed = true;
            }
            if (($feature['description_ar'] ?? null) === $swap['old_corrosion_desc']) {
                $feature['description_ar'] = $swap['new_corrosion_desc'];
                $changed = true;
            }
        }
        unset($feature);

        if ($changed) {
            DB::table('products')
                ->where('slug', 'tmt-bars')
                ->update([
                    'features' => json_encode($features, JSON_UNESCAPED_UNICODE),
                    'updated_at' => now(),
                ]);
        }
    }
};
