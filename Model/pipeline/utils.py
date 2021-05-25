import functools
import time

def timer(func):
    @functools.wraps(func)
    def wrapper_timer(*args, **kwargs):
        start = time.time()
        value = func(*args, **kwargs)
        end = time.time()
        elapsed_time = end - start
        print(f"Elapsed time: {elapsed_time:0.4f} seconds")
        return value
    return wrapper_timer