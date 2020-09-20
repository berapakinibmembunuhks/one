/**
 * @packageDocumentation
 * @module run-z/builtins
 */
import { clz } from '@run-z/optionz/colors';
import type { ZExtension, ZTaskOption } from '../core';
import { NamedZBatches, ZBatcher } from '../core';

/**
 * Built-in extension supporting named batches selection.
 *
 * Supports `--only` (`-y`), `--with` (`-w`), and `--except` (`-x`) options.
 */
export const NamedZBatchesBuiltin: ZExtension = {
  options: {
    '--only': {
      read: readOnlyZTaskOption,
      meta: {
        group: '!builtin:batch',
        get usage() {
          return `--only ${clz.param('BATCH')}${clz.optional(clz.param('BATCH') + '...')}`;
        },
        description: 'Limit named batches to select to specified ones.',
      },
    },
    '-y*': {
      read: readOnlyZTaskOption,
      meta: {
        aliasOf: '--only',
        get usage() {
          return `-y${clz.param('BATCH')}${clz.optional(clz.param('BATCH') + '...')}`;
        },
      },
    },
    '-y': {
      read: readOnlyZTaskOption,
      meta: {
        aliasOf: '--only',
        get usage() {
          return `-y ${clz.param('BATCH')}${clz.optional(clz.param('BATCH') + '...')}`;
        },
      },
    },

    '--with': {
      read: readWithZTaskOption,
      meta: {
        group: '!builtin:batch',
        get usage() {
          return `--with ${clz.param('BATCH')}${clz.optional(clz.param('BATCH') + '...')}`;
        },
        description: 'Enable additional named batches selection. '
            + 'I.e. those with `+`-prefixed names disabled by default.',
      },
    },
    '-w*': {
      read: readWithZTaskOption,
      meta: {
        aliasOf: '--with',
        get usage() {
          return `-w${clz.param('BATCH')}${clz.optional(clz.param('BATCH') + '...')}`;
        },
      },
    },
    '-w': {
      read: readWithZTaskOption,
      meta: {
        aliasOf: '--with',
        get usage() {
          return `-w ${clz.param('BATCH')}${clz.optional(clz.param('BATCH') + '...')}`;
        },
      },
    },

    '--except': {
      read: readExceptZTaskOption,
      meta: {
        group: '!builtin:batch',
        get usage() {
          return `--except ${clz.param('BATCH')}${clz.optional(clz.param('BATCH') + '...')}`;
        },
        description: 'Excludes named batches selection.',
      },
    },
    '-x*': {
      read: readExceptZTaskOption,
      meta: {
        aliasOf: '--except',
        get usage() {
          return `-x${clz.param('BATCH')}${clz.optional(clz.param('BATCH') + '...')}`;
        },
      },
    },
    '-x': {
      read: readExceptZTaskOption,
      meta: {
        aliasOf: '--except',
        get usage() {
          return `-x ${clz.param('BATCH')}${clz.optional(clz.param('BATCH') + '...')}`;
        },
      },
    },

    '--all'(option) {
      option.defer(() => {
        option.setBatching(
            option.batching.rule(NamedZBatches).reset(),
        );
      });
    },
  },
};

/**
 * @internal
 */
function readZBatchNames(option: ZTaskOption): readonly string[] | undefined {

  const [value] = option.values(1);

  if (!value) {
    option.unrecognize();
    return;
  }

  return value.split(',').map(name => name.trim());
}

/**
 * @internal
 */
function readOnlyZTaskOption(option: ZTaskOption): void {

  const batchNames = readZBatchNames(option);

  if (batchNames) {
    option.setBatching(
        option.batching.batchByDefault(ZBatcher.topmost()).rule(NamedZBatches).setOnly(batchNames),
    );
  }
}

/**
 * @internal
 */
function readWithZTaskOption(option: ZTaskOption): void {

  const batchNames = readZBatchNames(option);

  if (batchNames) {
    option.setBatching(
        option.batching.batchByDefault(ZBatcher.topmost()).rule(NamedZBatches).addWith(batchNames),
    );
  }
}

/**
 * @internal
 */
function readExceptZTaskOption(option: ZTaskOption): void {

  const batchNames = readZBatchNames(option);

  if (batchNames) {
    option.setBatching(
        option.batching.batchByDefault(ZBatcher.topmost()).rule(NamedZBatches).addExcept(batchNames),
    );
  }
}
