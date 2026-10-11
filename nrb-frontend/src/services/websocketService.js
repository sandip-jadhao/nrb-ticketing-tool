import { Client } from '@stomp/stompjs';

class WebSocketService {
  constructor() {
    this.client = null;
    this.subscriptions = new Map();
    this.connected = false;
  }

  connect(onConnected) {
    if (this.client && this.connected) {
      if (onConnected) onConnected();
      return;
    }

    this.client = new Client({
      brokerURL: 'ws://localhost:8080/ws-ticketing',
      reconnectDelay: 5000,
      debug: (str) => {
        console.log('[STOMP]:', str);
      },
      onConnect: () => {
        this.connected = true;
        console.log('>>> [STOMP]: CONNECTED LIVE <<<');
        if (onConnected) onConnected();
      },
      onDisconnect: () => {
        this.connected = false;
      },
      onStompError: (frame) => {
        console.error('STOMP broker error:', frame.headers['message']);
      },
    });

    this.client.activate();
  }

  subscribe(topic, callback) {
    if (!this.client || !this.connected) {
      setTimeout(() => this.subscribe(topic, callback), 300);
      return;
    }

    if (this.subscriptions.has(topic)) {
      this.subscriptions.get(topic).unsubscribe();
    }

    const sub = this.client.subscribe(topic, (message) => {
      try {
        const data = JSON.parse(message.body);
        callback(data);
      } catch (err) {
        console.error('Failed to parse incoming WebSocket message', err);
      }
    });

    this.subscriptions.set(topic, sub);
    return sub;
  }

  unsubscribe(topic) {
    if (this.subscriptions.has(topic)) {
      this.subscriptions.get(topic).unsubscribe();
      this.subscriptions.delete(topic);
    }
  }

  disconnect() {
    if (this.client) {
      this.client.deactivate();
      this.connected = false;
    }
  }
}

export const wsService = new WebSocketService();