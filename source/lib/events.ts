type Listener = () => void;

class EventEmitter {
  private listeners: { [key: string]: Listener[] } = {};

  on(event: string, callback: Listener) {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event].push(callback);
  }

  off(event: string, callback: Listener) {
    if (!this.listeners[event]) return;
    this.listeners[event] = this.listeners[event].filter(
      (cb) => cb !== callback
    );
  }

  emit(event: string) {
    if (!this.listeners[event]) return;
    this.listeners[event].forEach((callback) => callback());
  }
}

export const eventEmitter = new EventEmitter();
