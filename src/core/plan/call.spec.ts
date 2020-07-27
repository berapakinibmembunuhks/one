import { valueProvider } from '@proc7ts/primitives';
import { ZPackageTree } from '../packages';
import { ZSetup } from '../setup';
import type { ZTask, ZTaskSpec } from '../tasks';
import type { ZCall } from './call';
import type { ZTaskParams } from './task-params';

describe('ZCall', () => {

  let setup: ZSetup;
  let initParams: ZTaskParams.Values;
  let task: ZTask;

  beforeEach(async () => {
    setup = new ZSetup();

    const tree = new ZPackageTree('root', { packageJson: { name: 'root' } });

    initParams = {
      attrs: { attr1: ['attr1-val'] },
      args: ['arg1'],
      actionArgs: ['cmd-arg1'],
    };

    const spec: ZTaskSpec = {
      pre: [],
      attrs: initParams.attrs,
      args: initParams.args,
      action: {
        type: 'command',
        command: 'test-command',
        parallel: false,
        args: initParams.actionArgs,
      },
    };

    task = setup.taskFactory.createTask(await setup.packageResolver.get(tree), 'test', spec);
  });

  describe('call', () => {
    it('appends attribute values', async () => {

      const call = await plan({ attrs: { attr1: ['attr1-val2'] } });

      expect(call.params()).toEqual({
        ...initParams,
        attrs: { ...initParams.attrs, attr1: ['attr1-val', 'attr1-val2'] },
      });
    });
    it('adds attribute', async () => {

      const call = await plan({ attrs: { attr2: ['attr2-val'] } });

      expect(call.params()).toEqual({
        ...initParams,
        attrs: { ...initParams.attrs, attr2: ['attr2-val'] },
      });
    });
    it('appends args', async () => {

      const call = await plan({ args: ['arg2'] });

      expect(call.params()).toEqual({
        ...initParams,
        args: [...initParams.args, 'arg2'],
      });
    });
    it('appends action args', async () => {

      const call = await plan({ actionArgs: ['cmd-arg2'] });

      expect(call.params()).toEqual({
        ...initParams,
        actionArgs: [...initParams.actionArgs, 'cmd-arg2'],
      });
    });
  });

  describe('params', () => {
    it('cached', async () => {

      const call = await plan({ attrs: { attr1: ['attr1-val2'] } });

      expect(call.params()).toBe(call.params());
    });
    it('recalculated after plan modification', async () => {

      let call1!: ZCall;
      let params1!: ZTaskParams;
      let call2!: ZCall;
      let params2!: ZTaskParams;
      const call = await setup.planner.plan({
        task,
        params: valueProvider({ attrs: { attr1: ['attr1-val2'] } }),
        async plan(planner) {
          call1 = planner.plannedCall;
          params1 = call1.params();
          call2 = await planner.call({
            task,
            params: valueProvider({ attrs: { attr2: ['attr2-val2'] } }),
          });
          params2 = call1.params();
        },
      });

      expect(call1).toBe(call);
      expect(call2).toBe(call);
      expect(params1).not.toBe(params2);
      expect(params2).toBe(call.params());
    });
  });

  describe('extendParams', () => {
    it('extends params', async () => {

      const call = await plan();

      expect(call.extendParams({
        attrs: { attr1: ['attr1-val2'] },
        args: ['arg2'],
        actionArgs: ['cmd-arg2'],
      })()).toEqual({
        ...initParams,
        attrs: { ...initParams.attrs, attr1: ['attr1-val', 'attr1-val2'] },
        args: [...initParams.args, 'arg2'],
        actionArgs: [...initParams.actionArgs, 'cmd-arg2'],
      });
    });
  });

  function plan(params: ZTaskParams.Partial = {}): Promise<ZCall> {
    return setup.planner.plan({
      task,
      params: valueProvider(params),
    });
  }
});