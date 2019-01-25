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
Select country_id, country from country
where country in ('Afghanistan', 'Bangladesh', 'China');

-- 3a. You want to keep a description of each actor. You don't think you will be performing queries on a description, so create a column in the table actor named description and use the data type BLOB (Make sure to research the type BLOB, as the difference between it and VARCHAR are significant).
alter table actor
add column description blob;

select * from actor;

-- 3b. Very quickly you realize that entering descriptions for each actor is too much effort. Delete the description column.
alter table actor
drop column description;

select * from actor;

-- 4a. List the last names of actors, as well as how many actors have that last name.
select last_name, count(last_name) from actor
group by last_name
order by last_name asc;

-- 4b. List last names of actors and the number of actors who have that last name, but only for names that are shared by at least two actors
select last_name, count(last_name) from actor
group by last_name
having count(last_name)>=2
order by count(last_name) desc;

-- 4c. The actor HARPO WILLIAMS was accidentally entered in the actor table as GROUCHO WILLIAMS. Write a query to fix the record.
select * from actor
where first_name='GROUCHO' or first_name='HARPO';

update actor
set first_name = 'HARPO'
where first_name = 'GROUCHO' and last_name = 'WILLIAMS';

select * from actor
where first_name='GROUCHO' or first_name='HARPO';

-- 4d. Perhaps we were too hasty in changing GROUCHO to HARPO. It turns out that GROUCHO was the correct name after all! In a single query, if the first name of the actor is currently HARPO, change it to GROUCHO.

update actor
set first_name = 'GROUCHO'
where first_name = 'HARPO';

select * from actor
where first_name='GROUCHO' or first_name='HARPO';

-- 5a. You cannot locate the schema of the address table. Which query would you use to re-create it?
describe address;

-- 6a. Use JOIN to display the first and last names, as well as the address, of each staff member. Use the tables staff and address:
select s.first_name, s.last_name, a.address
from staff s left join address a
using (address_id);

-- 6b. Use JOIN to display the total amount rung up by each staff member in August of 2005. Use tables staff and payment.
select s.first_name, s.last_name, sum(p.amount)
from staff s left join payment p
using (staff_id)
where month(p.payment_date) = 5 and year(p.payment_date) = 2005
group by staff_id;

-- 6c. List each film and the number of actors who are listed for that film. Use tables film_actor and film. Use inner join.
select title, count(actor_id)
from film inner join film_actor
using (film_id)
group by (title)
order by count(actor_id) desc;

-- 6d. How many copies of the film Hunchback Impossible exist in the inventory system?
select count(inventory_id)
from film inner join inventory
using (film_id)
where title = 'Hunchback Impossible';

-- 6e. Using the tables payment and customer and the JOIN command, list the total paid by each customer. List the customers alphabetically by last name:
select first_name, last_name, sum(amount)
from customer left join payment
using (customer_id)
group by customer_id
order by last_name asc;

-- 7a. The music of Queen and Kris Kristofferson have seen an unlikely resurgence. As an unintended consequence, films starting with the letters K and Q have also soared in popularity. Use subqueries to display the titles of movies starting with the letters K and Q whose language is English.
select title
from film
where language_id in
	(
    select language_id from language
    where name = "English"
    )
Order by title asc;

-- 7b. Use subqueries to display all actors who appear in the film Alone Trip.
select first_name, last_name from actor
where actor_id in
	(
	select actor_id from film_actor
    where film_id in
		(
		select film_id from film
        where title = 'Alone Trip'
        )
    )
order by last_name, first_name;

-- 7c. You want to run an email marketing campaign in Canada, for which you will need the names and email addresses of all Canadian customers. Use joins to retrieve this information.
select c.first_name, c.last_name, c.email, co.country
from
	customer c
    join address a on c.address_id = a.address_id
    join city ci on a.city_id = ci.city_id
    join country co on ci.country_id = co.country_id
    having co.country = "Canada"
order by c.last_name, c.first_name;

-- 7d. Sales have been lagging among young families, and you wish to target all family movies for a promotion. Identify all movies categorized as family films.
select f.title, c.name
from
	film f
    join film_category fc on f.film_id = fc.film_id
    join category c on fc.category_id = c.category_id
    having c.name = "Family"
order by f.title;

-- 7e. Display the most frequently rented movies in descending order.
select f.title, count(r.rental_id)
from
	film f
    join inventory i on f.film_id = i.film_id
    join rental r on i.inventory_id = r.inventory_id
group by f.title
order by count(r.rental_id) desc, f.title asc;

-- 7f. Write a query to display how much business, in dollars, each store brought in.
-- 7g. Write a query to display for each store its store ID, city, and country.
-- 7h. List the top five genres in gross revenue in descending order. (Hint: you may need to use the following tables: category, film_category, inventory, payment, and rental.)

-- 8a. In your new role as an executive, you would like to have an easy way of viewing the Top five genres by gross revenue. Use the solution from the problem above to create a view. If you haven't solved 7h, you can substitute another query to create a view.
-- 8b. How would you display the view that you created in 8a?
-- 8c. You find that you no longer need the view top_five_genres. Write a query to delete it.



