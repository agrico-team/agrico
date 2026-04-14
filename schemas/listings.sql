CREATE TABLE IF NOT EXISTS category (
    category_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category_name TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS product (
    product_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES user_account ON DELETE CASCADE,
    category_id UUID NOT NULL REFERENCES category, -- ON DELETE CASCASDE, maybe not

    product_title TEXT NOT NULL,
    product_description TEXT NOT NULL,

    product_quantity INTEGER NOT NULL DEFAULT 0,
    product_unit_price NUMERIC(19, 4) NOT NULL, 

    product_delivery_date DATE NOT NULL, -- might change,

    product_status TEXT NOT NULL DEFAULT 'public',

    date_created TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT positive_product_quantity CHECK (product_quantity >= 0),
    CONSTRAINT positive_product_unit_price CHECK (product_unit_price >= 0),
    CONSTRAINT product_status_values CHECK (product_status IN ('public', 'private'))
);

CREATE TABLE IF NOT EXISTS service (
    service_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES user_account ON DELETE CASCADE,
    category_id UUID NOT NULL REFERENCES category, -- ON DELETE CASCASDE, maybe not

    service_title TEXT NOT NULL,
    service_description TEXT NOT NULL,

    service_unit TEXT NOT NULL,
    service_unit_price NUMERIC(19, 4) NOT NULL CHECK (service_unit_price >= 0),

    service_availability TEXT NOT NULL,

    service_status TEXT NULL DEFAULT 'public',

    date_created TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP

    CONSTRAINT service_status_values CHECK (service_status IN ('public', 'private'))
);