package com.personal.ticketsimulator.simulation;

import com.personal.ticketsimulator.domain.Ticket;

import java.util.ArrayDeque;
import java.util.Deque;
import java.util.Optional;
import java.util.concurrent.locks.Condition;
import java.util.concurrent.locks.ReentrantLock;

public class TicketPool {

    private final ReentrantLock lock = new ReentrantLock(true);
    private final Condition notEmptyVip = lock.newCondition();
    private final Condition notEmptyRegular = lock.newCondition();
    private final Condition notFull = lock.newCondition();

    private final Deque<Ticket> pool = new ArrayDeque<>();

    private int released = 0;
    private int sold = 0;

    private final int maxCapacity;
    private final int totalLimit;

    private int vipWaiters = 0;

    public TicketPool(int maxCapacity, int totalLimit) {
        this.maxCapacity = maxCapacity;
        this.totalLimit = totalLimit;
    }

    // Producer adds ONE ticket (you can loop in Vendor for rate)
    public boolean addOne() throws InterruptedException {
        lock.lock();
        try {
            if (released >= totalLimit) return false;

            while (pool.size() >= maxCapacity) {
                notFull.await();
            }

            pool.addLast(new Ticket());
            released++;

            // VIP priority wake-up
            if (vipWaiters > 0) notEmptyVip.signal();
            else notEmptyRegular.signal();

            return true;
        } finally {
            lock.unlock();
        }
    }

    // Consumer removes ONE ticket; VIP chooses VIP condition
    public Optional<Ticket> removeOne(boolean vip) throws InterruptedException {
        lock.lock();
        try {
            if (vip) vipWaiters++;
            try {
                while (pool.isEmpty()) {
                    if (vip) notEmptyVip.await();
                    else notEmptyRegular.await();
                }

                Ticket t = pool.removeFirst();
                sold++;
                notFull.signal();
                return Optional.of(t);
            } finally {
                if (vip) vipWaiters--;
            }
        } finally {
            lock.unlock();
        }
    }

    // ---- Read-only helpers ----
    public int available() {
        lock.lock();
        try { return pool.size(); }
        finally { lock.unlock(); }
    }

    public int released() {
        lock.lock();
        try { return released; }
        finally { lock.unlock(); }
    }

    public int sold() {
        lock.lock();
        try { return sold; }
        finally { lock.unlock(); }
    }

    public int maxCapacity() { return maxCapacity; }
    public int totalLimit() { return totalLimit; }
}
