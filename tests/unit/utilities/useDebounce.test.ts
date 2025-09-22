import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useDebounce } from '@/utilities/useDebounce'

describe('useDebounce', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('returns initial value immediately', () => {
    const { result } = renderHook(() => useDebounce('initial', 300))

    expect(result.current).toBe('initial')
  })

  it('debounces value updates with default delay', () => {
    const { result, rerender } = renderHook(({ value, delay }) => useDebounce(value, delay), {
      initialProps: { value: 'initial', delay: undefined },
    })

    expect(result.current).toBe('initial')

    // Update value
    rerender({ value: 'updated', delay: undefined })

    // Should still be initial value
    expect(result.current).toBe('initial')

    // Fast forward default delay (200ms)
    act(() => {
      vi.advanceTimersByTime(200)
    })

    // Now should be updated
    expect(result.current).toBe('updated')
  })

  it('debounces value updates with custom delay', () => {
    const { result, rerender } = renderHook(({ value, delay }) => useDebounce(value, delay), {
      initialProps: { value: 'initial', delay: 500 },
    })

    expect(result.current).toBe('initial')

    // Update value
    rerender({ value: 'updated', delay: 500 })

    // Should still be initial value
    expect(result.current).toBe('initial')

    // Fast forward partial delay
    act(() => {
      vi.advanceTimersByTime(300)
    })

    // Should still be initial value
    expect(result.current).toBe('initial')

    // Fast forward remaining delay
    act(() => {
      vi.advanceTimersByTime(200)
    })

    // Now should be updated
    expect(result.current).toBe('updated')
  })

  it('cancels previous timeout on rapid updates', () => {
    const { result, rerender } = renderHook(({ value }) => useDebounce(value, 300), {
      initialProps: { value: 'initial' },
    })

    expect(result.current).toBe('initial')

    // First update
    rerender({ value: 'first' })

    // Fast forward partial delay
    act(() => {
      vi.advanceTimersByTime(150)
    })

    // Second update before first completes
    rerender({ value: 'second' })

    // Fast forward remaining time from first update
    act(() => {
      vi.advanceTimersByTime(150)
    })

    // Should still be initial (first update was cancelled)
    expect(result.current).toBe('initial')

    // Fast forward remaining time for second update
    act(() => {
      vi.advanceTimersByTime(150)
    })

    // Now should be the second value
    expect(result.current).toBe('second')
  })

  it('handles multiple rapid updates correctly', () => {
    const { result, rerender } = renderHook(({ value }) => useDebounce(value, 200), {
      initialProps: { value: 'initial' },
    })

    // Rapid updates
    rerender({ value: 'first' })
    rerender({ value: 'second' })
    rerender({ value: 'third' })
    rerender({ value: 'final' })

    // Should still be initial
    expect(result.current).toBe('initial')

    // Fast forward the delay
    act(() => {
      vi.advanceTimersByTime(200)
    })

    // Should be the final value
    expect(result.current).toBe('final')
  })

  it('works with different data types', () => {
    // Test with numbers
    const { result: numberResult, rerender: numberRerender } = renderHook(
      ({ value }) => useDebounce(value, 100),
      { initialProps: { value: 0 } },
    )

    numberRerender({ value: 42 })
    act(() => {
      vi.advanceTimersByTime(100)
    })
    expect(numberResult.current).toBe(42)

    // Test with objects
    const { result: objectResult, rerender: objectRerender } = renderHook(
      ({ value }) => useDebounce(value, 100),
      { initialProps: { value: { name: 'initial' } } },
    )

    const newObject = { name: 'updated' }
    objectRerender({ value: newObject })
    act(() => {
      vi.advanceTimersByTime(100)
    })
    expect(objectResult.current).toEqual(newObject)

    // Test with arrays
    const { result: arrayResult, rerender: arrayRerender } = renderHook(
      ({ value }) => useDebounce(value, 100),
      { initialProps: { value: [1, 2, 3] } },
    )

    const newArray = [4, 5, 6]
    arrayRerender({ value: newArray })
    act(() => {
      vi.advanceTimersByTime(100)
    })
    expect(arrayResult.current).toEqual(newArray)
  })

  it('handles zero delay', () => {
    const { result, rerender } = renderHook(({ value }) => useDebounce(value, 0), {
      initialProps: { value: 'initial' },
    })

    rerender({ value: 'updated' })

    // With zero delay, should update immediately on next tick
    act(() => {
      vi.advanceTimersByTime(0)
    })

    expect(result.current).toBe('updated')
  })

  it('cleans up timeout on unmount', () => {
    const clearTimeoutSpy = vi.spyOn(global, 'clearTimeout')

    const { unmount, rerender } = renderHook(({ value }) => useDebounce(value, 300), {
      initialProps: { value: 'initial' },
    })

    // Update value to create a timeout
    rerender({ value: 'updated' })

    // Unmount before timeout completes
    unmount()

    // Should have called clearTimeout
    expect(clearTimeoutSpy).toHaveBeenCalled()
  })

  it('handles changing delay value', () => {
    const { result, rerender } = renderHook(({ value, delay }) => useDebounce(value, delay), {
      initialProps: { value: 'initial', delay: 300 },
    })

    // Update value with initial delay
    rerender({ value: 'updated', delay: 300 })

    // Change delay before timeout
    rerender({ value: 'updated', delay: 100 })

    // Fast forward with new delay
    act(() => {
      vi.advanceTimersByTime(100)
    })

    expect(result.current).toBe('updated')
  })

  it('handles null and undefined values', () => {
    const { result, rerender } = renderHook(({ value }) => useDebounce(value, 100), {
      initialProps: { value: null },
    })

    expect(result.current).toBe(null)

    rerender({ value: undefined })
    act(() => {
      vi.advanceTimersByTime(100)
    })

    expect(result.current).toBe(undefined)

    rerender({ value: 'defined' })
    act(() => {
      vi.advanceTimersByTime(100)
    })

    expect(result.current).toBe('defined')
  })

  it('maintains referential equality for unchanged values', () => {
    const initialObject = { name: 'test' }
    const { result, rerender } = renderHook(({ value }) => useDebounce(value, 100), {
      initialProps: { value: initialObject },
    })

    expect(result.current).toBe(initialObject)

    // Update with same reference
    rerender({ value: initialObject })
    act(() => {
      vi.advanceTimersByTime(100)
    })

    // Should maintain same reference
    expect(result.current).toBe(initialObject)
  })
})
