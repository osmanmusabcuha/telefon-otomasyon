ALTER TABLE repairs
ADD CONSTRAINT fk_customer
FOREIGN KEY (customer_id) REFERENCES users(id);
