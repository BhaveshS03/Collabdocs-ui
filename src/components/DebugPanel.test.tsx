export const __tests__ = `
import React from 'react';
import { render, screen, act, waitFor } from '@testing-library/react';
import DebugPanel from './DebugPanel';

function makeFakeProvider(initialClients = [1]) {
    let states = new Map(initialClients.map((id) => [id, { user: { name: 'User' + id } }]));
    const listeners: Record<string, Set<Function>> = { update: new Set(), change: new Set(), status: new Set() };
    return {
        awareness: {
            getStates() { return states; },
            on(ev, cb) { listeners[ev]?.add(cb); },
            off(ev, cb) { listeners[ev]?.delete(cb); },
            // helper for tests
            __addClient(id) { 
                states.set(id, { user: { name: 'User' + id } }); 
                listeners.update.forEach((cb) => cb()); 
                listeners.change.forEach((cb) => cb()); 
            },
            __removeClient(id) { 
                states.delete(id); 
                listeners.update.forEach((cb) => cb()); 
                listeners.change.forEach((cb) => cb()); 
            },
        },
        wsconnected: true,
        on(ev, cb) { listeners[ev]?.add(cb); },
        off(ev, cb) { listeners[ev]?.delete(cb); },
        __emitStatus(status) { listeners.status.forEach((cb) => cb({ status })); }
    };
}

test('renders provider info', async () => {
    const prov = makeFakeProvider([11, 22]);
    render(<DebugPanel provider={prov as any} pollInterval={10000} />);
    
    expect(await screen.findByText(/Connected users count:/)).toBeInTheDocument();
    expect(screen.getByText('11')).toBeInTheDocument();
    expect(screen.getByText('22')).toBeInTheDocument();
});

test('responds to awareness updates', async () => {
    const prov = makeFakeProvider([1]);
    render(<DebugPanel provider={prov as any} pollInterval={10000} />);
    
    // Wait for initial render
    expect(await screen.findByText('1')).toBeInTheDocument();

    await act(async () => {
        (prov.awareness as any).__addClient(2);
    });

    // Wait for the update to appear
    expect(await screen.findByText('2')).toBeInTheDocument();
});

test('shows websocket status changes', async () => {
    const prov = makeFakeProvider([1]);
    render(<DebugPanel provider={prov as any} pollInterval={10000} />);
    
    // Wait for component to mount
    await screen.findByText(/WebSocket status:/);

    await act(async () => {
        (prov as any).__emitStatus('connected');
    });
    
    // The status appears in a <code> tag after "WebSocket status:"
    await waitFor(() => {
        expect(screen.getByText('connected')).toBeInTheDocument();
    });
});

test('shows disconnected status', async () => {
    const prov = makeFakeProvider([1]);
    prov.wsconnected = false;
    
    render(<DebugPanel provider={prov as any} pollInterval={10000} />);
    
    await act(async () => {
        (prov as any).__emitStatus('disconnected');
    });
    
    await waitFor(() => {
        expect(screen.getByText('disconnected')).toBeInTheDocument();
    });
});
`;