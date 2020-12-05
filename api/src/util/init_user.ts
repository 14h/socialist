import { Database, get_redis_client } from '../core/db';
import { logger } from './logger';
import { prepare_deps } from './helpers';
import { UserRole } from '../res/rights';

const SO7_INIT_MARKER_NAME = 'so7:config:init';

export const ensure_init_user = async () => {
    const { get, set } = new Database({
        get_redis_client,
    });

    const existingInitMarker = await get(SO7_INIT_MARKER_NAME);

    if (existingInitMarker) {
        return;
    }

    logger.warn('Creating default root user..');

    const depsFactory = prepare_deps();

    const deps = depsFactory(
        null,
    );

    const userEnvelope = await deps.user.create({
        email: 'root@gds.fauna.dev',
        firstname: 'Root',
        lastname: 'User',
        password: String(Math.floor(Math.PI * Math.E * 1e12)),
    });

    await deps.user.set_roles(userEnvelope.id, [ UserRole.ADMIN ]);

    await set(
        SO7_INIT_MARKER_NAME,
        '1',
    );
};
