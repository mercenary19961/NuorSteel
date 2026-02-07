import { useEffect } from 'react';
import { usePage } from '@inertiajs/react';
import type { PageProps } from '@/types';
import { useToast } from '@/contexts/ToastContext';

export default function FlashMessages() {
    const { flash } = usePage<PageProps>().props;
    const { success, error } = useToast();

    useEffect(() => {
        if (flash.success) {
            success(flash.success);
        }
        if (flash.error) {
            error(flash.error);
        }
    }, [flash.success, flash.error, success, error]);

    return null;
}
