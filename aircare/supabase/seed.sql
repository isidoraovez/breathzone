-- Small illustrative starter set for local/preview use. Verify every venue and coordinate before production.
with inserted as (
  insert into public.spots (name, type, category, geom, latitude, longitude, address)
  values
    ('City Park', 'outdoor', 'running', extensions.st_setsrid(extensions.st_makepoint(21.415, 42.004), 4326)::extensions.geography, 42.004, 21.415, 'Gradski Park, Skopje'),
    ('Vardar Quay', 'outdoor', 'running', extensions.st_setsrid(extensions.st_makepoint(21.432, 41.995), 4326)::extensions.geography, 41.995, 21.432, 'Riverside promenade, Skopje'),
    ('Vodno Trails', 'outdoor', 'multi', extensions.st_setsrid(extensions.st_makepoint(21.393, 41.968), 4326)::extensions.geography, 41.968, 21.393, 'Middle Vodno, Skopje'),
    ('Sports Center Boris Trajkovski', 'indoor', 'multi', extensions.st_setsrid(extensions.st_makepoint(21.405, 42.006), 4326)::extensions.geography, 42.006, 21.405, 'Aminta Treti, Skopje')
  returning id, name
)
update public.spots outdoor
set indoor_alternative_id = indoor.id
from inserted indoor
where outdoor.name in ('City Park', 'Vardar Quay', 'Vodno Trails')
  and indoor.name = 'Sports Center Boris Trajkovski';
