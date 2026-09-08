import { INDEX_CONTENT } from '../data/index-content';

/**
 * The INDEX locator is canonical and hash-bound. Outbound URLs are derived from
 * it rather than restated, so no second truth about the public presence can
 * drift into existence.
 */
const profileLocator: string = INDEX_CONTENT.closing.locator;

if (!/^github\.com\/[A-Za-z0-9](?:[A-Za-z0-9-]{0,37}[A-Za-z0-9])?$/.test(profileLocator)) {
    throw new Error(
        `Unsupported GitHub profile locator: ${profileLocator}`,
    );
}

export const GITHUB_PROFILE_LOCATOR = profileLocator;
export const GITHUB_PROFILE_URL = `https://${profileLocator}`;

/**
 * This repository. Public, and the only inspectable engineering artifact
 * published in V1.
 */
export const SITE_REPOSITORY_LOCATOR = `${profileLocator}/sstm117-site`;
export const SITE_REPOSITORY_URL = `https://${SITE_REPOSITORY_LOCATOR}`;
