/**
 * @packageDocumentation
 * @module run-z
 */
import type { ZSetup } from '../setup';
import type { ZTask, ZTaskQualifier, ZTaskSpec } from '../tasks';
import type { ZCall } from './call';
import type { ZCallDetails } from './call-details';

/**
 * Task execution planner.
 *
 * It is used to record task execution instructions.
 *
 * @typeparam TAction  Task action type.
 */
export interface ZCallPlanner<TAction extends ZTaskSpec.Action = ZTaskSpec.Action> {

  /**
   * Task execution setup instance.
   */
  readonly setup: ZSetup;

  /**
   * Planned task call.
   *
   * All instructions recorded by this planner are related to this call.
   */
  readonly plannedCall: ZCall<TAction>;

  /**
   * Qualifies the task.
   *
   * Add the given qualifier to the task.
   *
   * @param task  Target task to add qualifier to.
   * @param qualifier  Qualifier to add to the task.
   */
  qualify(this: void, task: ZTask, qualifier: ZTaskQualifier): void;

  /**
   * Records a call to the task.
   *
   * Updates already recorded call to the same task.
   *
   * @typeparam TAction  Task action type.
   * @param task  The task to call.
   * @param details  The details of the call.
   *
   * @returns A promise resolved to the task call when it is recorded.
   */
  call<TAction extends ZTaskSpec.Action>(
      this: void,
      task: ZTask<TAction>,
      details?: ZCallDetails<TAction>,
  ): Promise<ZCall<TAction>>;

  /**
   * Establishes the task execution order.
   *
   * The call to this method does not cause any of the tasks to be executed.
   *
   * When any of the tasks executed it first executes its prerequisites. I.e. the tasks ordered before it.
   * The task itself will be executed only after each prerequisite completes, unless that prerequisite can be executed
   * {@link makeParallel in parallel}.
   *
   * Contradictory execution order causes one of the tasks to be executed before prerequisite.
   *
   * @param first  The task executed first.
   * @param second  The task executed after the first one.
   */
  order(this: void, first: ZTask, second: ZTask): void;

  /**
   * Allow parallel tasks execution.
   *
   * The call to this method does not cause any of the tasks to be executed.
   *
   * @param tasks  Array of qualifiers of the tasks that can be executed in parallel to each other.
   */
  makeParallel(this: void, tasks: readonly ZTaskQualifier[]): void;

}