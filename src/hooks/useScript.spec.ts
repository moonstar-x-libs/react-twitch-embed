import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { act, renderHook, waitFor } from '@testing-library/react';
import useScript from './useScript';

describe('Hooks -> useScript', () => {
  const spyForCreateElement = jest.spyOn(document, 'createElement');

  beforeEach(() => {
    document.querySelectorAll('script').forEach((script): void => {
      script.remove();
    });
    spyForCreateElement.mockClear();
  });

  it('should create a script element.', () => {
    renderHook(() => useScript('https://example.com/first.js'));
    expect(spyForCreateElement).toHaveBeenCalledWith('script');
  });

  it('should append the script to the document with the given src.', () => {
    const source = 'https://example.com/second.js';
    renderHook(() => useScript(source));
    expect(document.querySelector(`script[src="${CSS.escape(source)}"]`)).toBeInTheDocument();
  });

  it('should start in a loading state.', () => {
    const { result } = renderHook(() => useScript('https://example.com/third.js'));
    expect(result.current).toEqual({ loading: true, error: null });
  });

  it('should error out when no src is provided.', async () => {
    const { result } = renderHook(() => useScript(''));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });
    expect(result.current.error).toBeInstanceOf(Error);
  });

  it('should reuse an already existing script instead of appending a new one.', () => {
    const source = 'https://example.com/shared.js';
    renderHook(() => useScript(source));
    spyForCreateElement.mockClear();

    renderHook(() => useScript(source));

    expect(spyForCreateElement).not.toHaveBeenCalledWith('script');
    expect(document.querySelectorAll(`script[src="${CSS.escape(source)}"]`)).toHaveLength(1);
  });

  it('should sync with an already existing script that finished loading.', async () => {
    const source = 'https://example.com/already-loaded.js';
    const first = renderHook(() => useScript(source));

    act(() => {
      document.querySelector(`script[src="${CSS.escape(source)}"]`)?.dispatchEvent(new Event('load'));
    });

    await waitFor(() => {
      expect(first.result.current.loading).toBe(false);
    });
    first.unmount();
    spyForCreateElement.mockClear();

    const { result } = renderHook(() => useScript(source));

    await waitFor(() => {
      expect(result.current).toEqual({ loading: false, error: null });
    });
    expect(spyForCreateElement).not.toHaveBeenCalledWith('script');
    expect(document.querySelectorAll(`script[src="${CSS.escape(source)}"]`)).toHaveLength(1);
  });

  it('should settle once the script loads.', async () => {
    const source = 'https://example.com/loads.js';
    const { result } = renderHook(() => useScript(source));

    act(() => {
      document.querySelector(`script[src="${CSS.escape(source)}"]`)?.dispatchEvent(new Event('load'));
    });

    await waitFor(() => {
      expect(result.current).toEqual({ loading: false, error: null });
    });
  });

  it('should settle with an error when the script fails to load.', async () => {
    const source = 'https://example.com/fails.js';
    const { result } = renderHook(() => useScript(source));

    act(() => {
      document.querySelector(`script[src="${CSS.escape(source)}"]`)?.dispatchEvent(new Event('error'));
    });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });
    expect(result.current.error).toBeInstanceOf(Error);
  });
});
