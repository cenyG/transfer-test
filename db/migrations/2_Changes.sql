CREATE TABLE IF NOT EXISTS changes (
    id SERIAL PRIMARY KEY,
    from_id INTEGER NOT NULL,
    to_id INTEGER NOT NULL,
    was_from NUMERIC(78,18),
    was_to NUMERIC(78,18),
    transfer_amount NUMERIC(78,18)
);