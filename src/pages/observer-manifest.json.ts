import type { APIRoute } from 'astro';

import { buildObserverManifest } from '../lib/observer-manifest';

export const prerender = true;

export const GET: APIRoute = async () => {
    const manifest = await buildObserverManifest();

    return new Response(JSON.stringify(manifest, null, 2) + '\n', {
        headers: {
            'Content-Type': 'application/json; charset=utf-8',
        },
    });
};
