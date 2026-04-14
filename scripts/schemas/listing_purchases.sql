CREATE TABLE IF NOT EXISTS product_order (
    order_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES user_account, -- ON DELETE CASCADE,
    total_amount NUMERIC(19, 4) NOT NULL,
    date_created TIMESTAMPTZ,

    CONSTRAINT positive_total_amount CHECK (total_amount >= 0)
);

CREATE TABLE IF NOT EXISTS service_reservation (
    reservation_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES user_account, -- ON DELETE CASCADE,
    total_amount NUMERIC(19, 4) NOT NULL,
    date_created TIMESTAMPTZ,

    CONSTRAINT positive_total_amount CHECK (total_amount >= 0)
);

CREATE TABLE IF NOT EXISTS order_item (
    item_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID REFERENCES product,
    order_id UUID REFERENCES product_order,
    item_status TEXT NOT NULL,
    item_unit_price NUMERIC(19, 4) NOT NULL,
    item_quantity INTEGER NOT NULL,
    item_delivery_date DATE NOT NULL,

    CONSTRAINT positive_item_quantity CHECK (item_quantity >= 0),
    CONSTRAINT positive_item_unit_price CHECK (item_unit_price >= 0),
    CONSTRAINT item_status_values CHECK (item_status IN ('pending', 'delivered', 'cancelled'))
);

CREATE TABLE IF NOT EXISTS reservation_item (
    item_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    service_id UUID REFERENCES service,
    reservation_id UUID REFERENCES service_reservation,
    
    item_status TEXT NOT NULL,
    item_unit TEXT NOT NULL,
    item_unit_price NUMERIC(19, 4) NOT NULL,
    item_quantity INTEGER NOT NULL,

    CONSTRAINT positive_item_quantity CHECK (item_quantity >= 0),
    CONSTRAINT positive_item_unit_price CHECK (item_unit_price >= 0),
    CONSTRAINT item_status_values CHECK (item_status IN ('pending', 'delivered', 'cancelled'))
);