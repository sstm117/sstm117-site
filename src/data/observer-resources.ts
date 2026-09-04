import type { SystemId } from './types';

export type ObserverResourceId =
    | 'site:field'
    | 'site:index'
    | `system:${SystemId}`;

export type ObserverResourceDescriptor =
    | {
          readonly id: 'site:field';
          readonly kind: 'field';
      }
    | {
          readonly id: 'site:index';
          readonly kind: 'index';
      }
    | {
          readonly id: `system:${SystemId}`;
          readonly kind: 'system';
          readonly systemId: SystemId;
      };

export const observerResources = [
    {
        id: 'site:field',
        kind: 'field',
    },
    {
        id: 'site:index',
        kind: 'index',
    },
    {
        id: 'system:obs',
        kind: 'system',
        systemId: 'obs',
    },
    {
        id: 'system:food',
        kind: 'system',
        systemId: 'food',
    },
    {
        id: 'system:moka',
        kind: 'system',
        systemId: 'moka',
    },
    {
        id: 'system:fnode',
        kind: 'system',
        systemId: 'fnode',
    },
] as const satisfies readonly ObserverResourceDescriptor[];
