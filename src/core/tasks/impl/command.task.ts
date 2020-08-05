import type { ZExecutedProcess, ZTaskExecution } from '../../jobs';
import { ZTaskParams } from '../../plan';
import type { ZTaskSpec } from '../task-spec';
import { AbstractZTask } from './abstract.task';

/**
 * @internal
 */
export class CommandZTask extends AbstractZTask<ZTaskSpec.Command> {

  exec(execution: ZTaskExecution<ZTaskSpec.Command>): ZExecutedProcess {
    return this.target.location.shell.execCommand(this.spec.action.command, execution.call.params());
  }

  protected callParams(): ZTaskParams {

    const { spec: { attrs, args, action: { args: commandArgs } } } = this;

    return new ZTaskParams({ attrs, args: [...commandArgs, ...args] });
  }

  protected isParallel(): boolean {
    return this.spec.action.parallel;
  }

}