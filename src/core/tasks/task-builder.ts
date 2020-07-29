/**
 * @packageDocumentation
 * @module run-z
 */
import type { ZPackage } from '../packages';
import type { ZTask } from './task';
import type { ZTaskSpec } from './task-spec';

/**
 * Task builder.
 *
 * Can be created by {@link ZTaskFactory.newTask task factory}, filled with task data, and the used to
 * {@link task build a task}.
 *
 * @typeparam TAction  Task action type the builder produces.
 */
export interface ZTaskBuilder<TAction extends ZTaskSpec.Action = ZTaskSpec.Action> {

  /**
   * Target package the task is applied to.
   */
  readonly target: ZPackage;

  /**
   * Task name.
   */
  readonly name: string;

  /**
   * Appends a task prerequisite.
   *
   * @param pre  Prerequisite specifier to append.
   *
   * @returns `this` instance.
   */
  addPre(pre: ZTaskSpec.Pre): this;

  /**
   * Appends a task attribute.
   *
   * @param name  Target attribute name.
   * @param value  Attribute value to append.
   *
   * @returns `this` instance.
   */
  addAttr(name: string, value: string): this;

  /**
   * Appends task attributes.
   *
   * @param attrs  Attributes to append
   *
   * @returns `this` instance.
   */
  addAttrs(attrs: ZTaskSpec.Attrs): this;

  /**
   * Appends raw command line argument(s) to the task.
   *
   * @param args  Command line argument(s) to append.
   *
   * @returns `this` instance.
   */
  addArg(...args: string[]): this;

  /**
   * Assigns a task action.
   *
   * The task action defaults to {@link Group grouping task} unless reassigned by this call.
   *
   * @typeparam TNewAction  New task action type.
   * @param action  Action to assign to the task.
   *
   * @returns `this` instance producing a task with new action type.
   */
  setAction<TNewAction extends ZTaskSpec.Action>(action: TNewAction): ZTaskBuilder<TNewAction>;

  /**
   * Parses a command line and {@link applyOptions applies} recognized options to the task.
   *
   * @param commandLine  Task command line to parse.
   *
   * @returns A promise resolved to `this` instance when the command line parsed.
   *
   * @see TaskFactory.parse
   */
  parse(commandLine: string): Promise<this>;

  /**
   * Recognized options from command line arguments and applies them to the task.
   *
   * @param args  Arguments to apply.
   *
   * @returns A promise resolved to `this` instance when command line options applied.
   *
   * @see TaskFactory.applyOptions
   */
  applyOptions(args: readonly string[]): Promise<this>;

  /**
   * Builds a task specifier with the data added to the builder.
   *
   * @returns New task specifier.
   */
  spec(): ZTaskSpec<TAction>;

  /**
   * Builds a task with the data added to the builder.
   *
   * @returns New task.
   */
  task(): ZTask<TAction>;

}