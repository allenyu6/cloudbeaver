/*
 * cloudbeaver - Cloud Database Manager
 * Copyright (C) 2020 DBeaver Corp and others
 *
 * Licensed under the Apache License, Version 2.0.
 * you may not use this file except in compliance with the License.
 */

import { injectable } from '@dbeaver/core/di';
import { GraphQLService, CachedResource } from '@dbeaver/core/sdk';

type PermissionsMetadata = {
  loaded: boolean;
}

@injectable()
export class PermissionsService {
  private permissions = new CachedResource(
    new Map(),
    this.refreshAsync.bind(this),
    (_, { loaded }) => loaded
  );

  constructor(
    private graphQLService: GraphQLService,
  ) { }

  has(id: string): boolean {
    return this.permissions.data.has(id);
  }

  async update() {
    await this.permissions.refresh();
  }

  private async refreshAsync(
    data: Map<string, string>,
    metadata: PermissionsMetadata
  ): Promise<Map<string, string>> {
    const { permissions } = await this.graphQLService.gql.sessionPermissions();

    data.clear();
    for (const permission of permissions) {
      data.set(permission, permission);
    }
    metadata.loaded = true;

    return data;
  }
}
