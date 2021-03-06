import flushPromises from 'flush-promises';
import { useField, useForm, useIsFormDirty } from '@/vee-validate';
import { mountWithHoc, setValue } from './helpers';

describe('useIsFormDirty()', () => {
  test('gives access to the forms isDirty status', async () => {
    mountWithHoc({
      setup() {
        useForm();
        const { value, handleInput } = useField('test');
        const isDirty = useIsFormDirty();

        return {
          value,
          isDirty,
          handleInput,
        };
      },
      template: `
      <input name="field" v-model="value" @input="handleInput" />
      <span>{{ isDirty.toString()  }}</span>
    `,
    });

    const input = document.querySelector('input');
    const error = document.querySelector('span');
    expect(error?.textContent).toBe('false');

    setValue(input as any, '');
    await flushPromises();
    expect(error?.textContent).toBe('true');
  });

  test('returns false and warns if form is not found', async () => {
    const spy = jest.spyOn(console, 'warn').mockImplementation();

    mountWithHoc({
      setup() {
        const isDirty = useIsFormDirty();

        return {
          isDirty,
        };
      },
      template: `
      <span>{{ isDirty.toString() }}</span>
    `,
    });

    const error = document.querySelector('span');

    await flushPromises();
    expect(error?.textContent).toBe('false');
    expect(spy).toHaveBeenCalled();
    spy.mockRestore();
  });
});
