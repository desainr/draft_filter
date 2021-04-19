const buildSqlQuery = (queryObj) => {
  const groupedFields = groupQueryFields(queryObj);

  let query = `
    SELECT
      p.player as player,
      t.id as team_id,
      t.team as team,
      p.college as college,
      p.position as position,
      dp.pick as pick,
      dp.round as round,
      dp.year as year,
      p.games as games,
      p.pass_tds as pass_tds,
      p.pass_ints as pass_ints,
      p.pass_yds as pass_yds,
      p.yds_per_att as yds_per_att,
      p.comp_pct as comp_pct,
      p.recs as recs,
      p.rec_yds as rec_yds,
      p.rec_tds as rec_tds,
      p.yds_per_rec as yds_per_rec,
      p.rush_yds as rush_yds,
      p.rush_tds as rush_tds,
      p.yds_per_rush as yds_per_rush,
      p.tackles as tackles,
      p.sacks as sacks,
      p.def_ints as def_ints,
      p.hof as hof,
      cs.height as height,
      cs.weight as weight,
      cs.forty_time as forty_time,
      cs.bench_press as bench_press,
      cs.vert_leap as vert_leap,
      cs.broad_jump as broad_jump,
      cs.shuttle as shuttle,
      cs.three_cone as three_cone
    FROM draft_picks dp
    LEFT JOIN players p on dp.player_id = p.id
    LEFT JOIN teams t on dp.team_id = t.id
    LEFT JOIN combine_stats cs on p.id = cs.player_id
    WHERE
`
  for (const field in groupedFields) {
    if (groupedFields[field].operator === 'like') {
      const searchTerms = groupedFields[field].value.split('|').map(s => `'%${s}%'`);

      query += `${field} like any (array[${searchTerms.toString()}])`
    } else if (groupedFields[field].operator === 'in') {
      const arrayItems = groupedFields[field].value.split(',').map(s => `'${s}'`);
      query += `${field} = ANY(array[${arrayItems.toString()}])`
    } else if (groupedFields[field].operator === 'bt') {
      query += `${field} >= ${groupedFields[field].startValue} AND ${field} <= ${groupedFields[field].endValue}`
    } else {
      query += `${field} ${groupedFields[field].operator} ${groupedFields[field].value} `
    }
    query += 'AND '
  }

  // remove last AND
  query = query.slice(0, -4);
  query += 'ORDER BY year desc, round, pick'
  return query;
};

// TODO: maybe remove this and just make the query string look like this?
const groupQueryFields = (queryObj) => {
  const fields = {};

  for (const key in queryObj) {
    if (key !== 'code') {
      const [field, param] = key.split('.')

      if (fields[field]) {
        fields[field][param] = queryObj[key];
      } else {
        fields[field] = {
          [param]: queryObj[key]
        }
      }
    }
  }

  return fields;
}

module.exports = buildSqlQuery;
