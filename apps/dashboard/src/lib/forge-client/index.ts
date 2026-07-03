export * from './types';
export * from './mock';

import { MockForgeClient } from './mock';
import type { ForgeClient } from './types';

// Default to mock client since backend APIs are being forged
export const client: ForgeClient = new MockForgeClient();
export default client;
