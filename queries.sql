select * from saboroso.tb_users;

select * from saboroso.tb_contacts;

select * from saboroso.tb_emails;


select * from saboroso.tb_menus;


select * from saboroso.tb_reservations
order by register desc;


where name = 'Janaina'
;

order by name
 LIMIT 0, 10
;

select sql_calc_found_rows * 
               from saboroso.tb_reservations 
               where date between '1990-01-01' and '1999-12-31'
               order by name 
               limit 0, 10;
              
               




 from saboroso.tb_emails where id > 4;

 from saboroso.tb_menus where id < 5;

commit;


desc saboroso.tb_reservations;



insert into saboroso.tb_emails
(email)
values
('fernando@yahoo.com')


SELECT
    (SELECT COUNT(*) FROM tb_contacts) AS nrcontacts,
    (SELECT COUNT(*) FROM tb_menus) AS nrmenus,
    (SELECT COUNT(*) FROM tb_reservations) AS nrreservations,
    (SELECT COUNT(*) FROM tb_users) AS nrusers;
    
   
   
   
select * from saboroso.tb_reservations order by name LIMIT 0, 10; 
   

select 
concat(year(date), '-', month(date)) as date,
count(*) as total,
sum(people) / count(*) as avg_people
from 
saboroso.tb_reservations
where 
date between '2017-09-04' and '2018-09-24'
group by year(date) desc, month(date) desc
order by year(date) desc, month(date) desc
;


select 
concat(year(date), '-', month(date)) as date,
count(*) as total,
sum(people) / count(*) as avg_people
from 
saboroso.tb_reservations
where 
date between '2017-09-04' and '2018-09-24'
group by year(date) , month(date) 
-- order by date desc -- by by year(date) desc, month(date) desc
;



select 
concat(year(date), '-', month(date)) as date,
count(*) as total,
sum(people) / count(*) as avg_people
from 
saboroso.tb_reservations
where 
date between '2017-09-04' and '2018-09-24'
group by concat(year(date), '-', month(date)) 
order by date desc
;

