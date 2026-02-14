import { useEffect, useRef } from 'react';
import { usePage } from '@inertiajs/react';
import type { PageProps } from '@/types';
import { useToast } from '@/contexts/ToastContext';

export default function FlashMessages() {
    const { flash } = usePage<PageProps>().props;
    const { success, error } = useToast();
    const lastFlash = useRef<{ success?: string; error?: string }>({});

    useEffect(() => {
        if (flash.success && flash.success !== lastFlash.current.success) {
            lastFlash.current.success = flash.success;
            success(flash.success);
        }
        if (flash.error && flash.error !== lastFlash.current.error) {
            lastFlash.current.error = flash.error;
            error(flash.error);
        }
    }, [flash.success, flash.error]);

    return null;
}
