-- HOMEWORK: 09-SQL
-- AUTHOR: Jeff Brown
-- GITHUB REPO: https://github.com/daddyjab/python-challenge/tree/master/MySQL

-- Use the sakila database
USE sakila;

-- 1a. Display the first and last names of all actors from the table actor.
SELECT first_name, last_name FROM actor;

-- 1b. Display the first and last name of each actor in a single column in upper case letters. Name the column Actor Name.
SELECT UPPER(CONCAT_WS(' ', first_name, last_name)) AS "Actor Name" FROM actor;

-- 2a. You need to find the ID number, first name, and last name of an actor, of whom you know only the first name, "Joe." What is one query would you use to obtain this information?
SELECT  actor_id, first_name, last_name FROM actor
WHERE first_name = "Joe";

-- 2b. Find all actors whose last name contain the letters GEN:
SELECT  actor_id, first_name, last_name FROM actor
WHERE last_name LIKE "%GEN%";

-- 2c. Find all actors whose last names contain the letters LI. This time, order the rows by last name and first name, in that order:
SELECT  actor_id, first_name, last_name FROM actor
WHERE last_name LIKE "%LI%"
ORDER BY last_name, first_name;

-- 2d. Using IN, display the country_id and country columns of the following countries: Afghanistan, Bangladesh, and China:
SELECT country_id, country FROM country
WHERE country IN ('Afghanistan', 'Bangladesh', 'China');

-- 3a. You want to keep a description of each actor. You don't think you will be performing queries on a description, so create a column in the table actor named description and use the data type BLOB (Make sure to research the type BLOB, as the difference between it and VARCHAR are significant).
ALTER TABLE actor
ADD COLUMN description BLOB;

SELECT * FROM actor;

-- 3b. Very quickly you realize that entering descriptions for each actor is too much effort. Delete the description column.
ALTER TABLE actor
DROP COLUMN description;

SELECT * FROM actor;

-- 4a. List the last names of actors, as well as how many actors have that last name.
SELECT last_name, COUNT(last_name) FROM actor
GROUP BY last_name
ORDER BY last_name ASC;

-- 4b. List last names of actors and the number of actors who have that last name, but only for names that are shared by at least two actors
SELECT last_name, COUNT(last_name) FROM actor
GROUP BY last_name
HAVING COUNT(last_name)>=2
ORDER BY COUNT(last_name) DESC;

-- 4c. The actor HARPO WILLIAMS was accidentally entered in the actor table as GROUCHO WILLIAMS. Write a query to fix the record.
SELECT * FROM actor
WHERE first_name='GROUCHO' OR first_name='HARPO';

UPDATE actor
SET first_name = 'HARPO'
WHERE first_name = 'GROUCHO' AND last_name = 'WILLIAMS';

SELECT * FROM actor
WHERE first_name='GROUCHO' OR first_name='HARPO';

-- 4d. Perhaps we were too hasty in changing GROUCHO to HARPO. It turns out that GROUCHO was the correct name after all! In a single query, if the first name of the actor is currently HARPO, change it to GROUCHO.

UPDATE actor
SET first_name = 'GROUCHO'
WHERE first_name = 'HARPO';

SELECT * FROM actor
WHERE first_name='GROUCHO' OR first_name='HARPO';

-- 5a. You cannot locate the schema of the address table. Which query would you use to re-create it?
--     Q: If I can't find the schema for the address table, how would I know what fields are in the table?
--     	  But, assuming someone told me what the fields were, here's the create table statement...
--     ALSO: I attempted to add a foreign key, but resulted in "Error Code: 1215. Cannot add foreign key constraint"
--           My attempted statement: "foreign key (city_id) references city(city_id)"


DROP TABLE IF EXISTS address_jab;

CREATE TABLE address_jab (
	address_id SMALLINT UNSIGNED AUTO_INCREMENT NOT NULL,
    address VARCHAR(50) NOT NULL,
    address2 VARCHAR(50),
    district VARCHAR(20) NOT NULL,
    city_id	SMALLINT UNSIGNED NOT NULL,
    postal_code VARCHAR(10),
    phone VARCHAR(20) NOT NULL,
    location GEOMETRY NOT NULL,
    last_update TIMESTAMP ON UPDATE CURRENT_TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (address_id),
	FOREIGN KEY (city_id) REFERENCES city(city_id)
		ON UPDATE CASCADE
        ON DELETE RESTRICT
    );
    
DESCRIBE address_jab;
DROP TABLE address_jab;

-- 6a. Use JOIN to display the first and last names, as well as the address, of each staff member. Use the tables staff and address:
SELECT s.first_name, s.last_name, a.address
FROM staff s LEFT JOIN address a
USING (address_id);

-- 6b. Use JOIN to display the total amount rung up by each staff member in August of 2005. Use tables staff and payment.
SELECT s.first_name, s.last_name, SUM(p.amount)
FROM staff s LEFT JOIN payment p
USING (staff_id)
WHERE MONTH(p.payment_date) = 5 AND YEAR(p.payment_date) = 2005
GROUP BY staff_id;

-- 6c. List each film and the number of actors who are listed for that film. Use tables film_actor and film. Use inner join.
SELECT title, COUNT(actor_id)
FROM film INNER JOIN film_actor
USING (film_id)
GROUP BY (title)
ORDER BY COUNT(actor_id) DESC;

-- 6d. How many copies of the film Hunchback Impossible exist in the inventory system?
SELECT COUNT(inventory_id)
FROM film INNER JOIN inventory
USING (film_id)
WHERE title = 'Hunchback Impossible';

-- 6e. Using the tables payment and customer and the JOIN command, list the total paid by each customer. List the customers alphabetically by last name:
SELECT first_name, last_name, SUM(amount)
FROM customer LEFT JOIN payment
USING (customer_id)
GROUP BY customer_id
ORDER BY last_name ASC;

-- 7a. The music of Queen and Kris Kristofferson have seen an unlikely resurgence. As an unintended consequence, films starting with the letters K and Q have also soared in popularity. Use subqueries to display the titles of movies starting with the letters K and Q whose language is English.
SELECT title
FROM film
WHERE (title like "K%" or title like "Q%") and language_id IN
	(
    SELECT language_id FROM language
    WHERE name = "English"
    )
ORDER BY title ASC;

-- 7b. Use subqueries to display all actors who appear in the film Alone Trip.
SELECT first_name, last_name FROM actor
WHERE actor_id IN
	(
	SELECT actor_id FROM film_actor
    WHERE film_id IN
		(
		SELECT film_id FROM film
        WHERE title = 'Alone Trip'
        )
    )
ORDER BY last_name, first_name;

-- 7c. You want to run an email marketing campaign in Canada, for which you will need the names and email addresses of all Canadian customers. Use joins to retrieve this information.
SELECT c.first_name, c.last_name, c.email, co.country
FROM
	customer c
    JOIN address a ON c.address_id = a.address_id
    JOIN city ci ON a.city_id = ci.city_id
    JOIN country co ON ci.country_id = co.country_id
    HAVING co.country = "Canada"
ORDER BY c.last_name, c.first_name;

-- 7d. Sales have been lagging among young families, and you wish to target all family movies for a promotion. Identify all movies categorized as family films.
SELECT f.title as "Title", c.name as "Category"
FROM
	film f
    JOIN film_category fc ON f.film_id = fc.film_id
    JOIN category c ON fc.category_id = c.category_id
    HAVING c.name = "Family"
ORDER BY f.title;

-- 7e. Display the most frequently rented movies in descending order.
SELECT f.title as "Title", COUNT(r.rental_id) as "Number of Rentals"
FROM
	film f
    JOIN inventory i ON f.film_id = i.film_id
    JOIN rental r ON i.inventory_id = r.inventory_id
GROUP BY f.title
ORDER BY COUNT(r.rental_id) DESC, f.title ASC;

-- 7f. Write a query to display how much business, in dollars, each store brought in.
SELECT s.store_id as "Store ID", SUM(p.amount) as "Total Rental Sales"
FROM
	payment p
    JOIN staff s ON p.staff_id = s.staff_id
GROUP BY s.store_id
ORDER BY SUM(p.amount) DESC, store_id ASC;

-- 7g. Write a query to display for each store its store ID, city, and country.
SELECT s.store_id, c.city, co.country
FROM
	store s
    JOIN address a ON s.address_id = a.address_id
    JOIN city c ON a.city_id = c.city_id
    JOIN country co ON c.country_id = co.country_id
GROUP BY store_id
ORDER BY store_id;

-- 7h. List the top five genres in gross revenue in descending order. (Hint: you may need to use the following tables: category, film_category, inventory, payment, and rental.)
SELECT c.name as "Film Category", SUM(p.amount) as "Gross Revenue"
FROM
	category c
    JOIN film_category fc ON c.category_id = fc.category_id
    JOIN inventory i ON fc.film_id = i.film_id
    JOIN rental r ON i.inventory_id = r.inventory_id
    JOIN payment p ON r.rental_id = p.rental_id
GROUP BY c.name
ORDER BY SUM(p.amount) DESC
LIMIT 5;
    
-- 8a. In your new role as an executive, you would like to have an easy way of viewing the Top five genres by gross revenue. Use the solution from the problem above to create a view. If you haven't solved 7h, you can substitute another query to create a view.
CREATE VIEW Top_5_Categories_by_Gross_Revenue AS
SELECT c.name as "Film Category", SUM(p.amount) as "Gross Revenue"
FROM
	category c
    JOIN film_category fc ON c.category_id = fc.category_id
    JOIN inventory i ON fc.film_id = i.film_id
    JOIN rental r ON i.inventory_id = r.inventory_id
    JOIN payment p ON r.rental_id = p.rental_id
GROUP BY c.name
ORDER BY SUM(p.amount) DESC
LIMIT 5;

-- 8b. How would you display the view that you created in 8a?
--     FYI: Can use SELECT to view the data with the view
--          Can use SHOW CREATE VIEW to see the SQL statements that comprise the view

SELECT * FROM Top_5_Categories_by_Gross_Revenue;
SHOW CREATE VIEW Top_5_Categories_by_Gross_Revenue;

-- 8c. You find that you no longer need the view top_five_genres. Write a query to delete it.
DROP VIEW IF EXISTS Top_5_Categories_by_Gross_Revenue;
