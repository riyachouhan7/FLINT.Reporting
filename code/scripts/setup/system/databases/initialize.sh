#!/bin/sh
# See: https://stackoverflow.com/questions/6405127/how-do-i-specify-a-password-to-psql-non-interactively#6405296
# See: https://stackoverflow.com/questions/14549270/check-if-database-exists-in-postgresql-using-shell

echo
echo "---------------------------------------------------------------------------------"
echo "Entering Databases Initialization Script"
echo "---------------------------------------------------------------------------------"
echo

echo
echo "Setting up Resource Paths"
echo

# root/project/scripts/setup/system/databases
DATABASES_DIR="$(cd "$(dirname "$0")" && pwd)"

# root/project/scripts/setup/system
SYSTEM_DIR="$(dirname "$DATABASES_DIR")"

# root/project/scripts/setup
SETUP_DIR="$(dirname "$SYSTEM_DIR")"

# root/project/scripts
SCRIPTS_DIR="$(dirname "$SETUP_DIR")"

# root/project/
PROJECT_DIR="$(dirname "$SCRIPTS_DIR")"


# Connection Details
# ----------------------------------------------------------------------------------

DEVELOPMENT_SERVER=0
CLOUD_SERVER=1

if [ $DEVELOPMENT_SERVER -eq 1 ]; then

  echo
  echo "Setting up local host connection details"
  echo

  export PGHOST="localhost"
  export PGPORT="5432"
  export PGUSER="postgres"
  export PGPASSWORD="postgres"

fi

if [ $CLOUD_SERVER -eq 1 ]; then

  echo
  echo "Setting up cloud host connection details"
  echo

  export PGHOST="localhost"
  export PGPORT="31392"
  export PGUSER="postgres"
  export PGPASSWORD="postgres"

fi

# Use the flags 1 and 0 below to configure the databases that you want to initialize
# 1 = on, 0 = off
# ----------------------------------------------------------------------------------

# Single databases
COVER_TYPES=1
EMISSION_TYPES=1
FLUXES_TO_REPORTING_VARIABLES=1
FLUX_TYPES=1
POOLS=1
REPORTING_FRAMEWORKS=1
REPORTING_TABLES=1
REPORTING_VARIABLES=1
UNIT_CATEGORIES=1
UNITS=1



# Database Collections



echo
echo "Initializing specific databases"
echo "---------------------------------------------------------------------------------"
echo


# cover types
# -------------------------------------------------------------------------------------
if [ $COVER_TYPES -eq 1 ]; then

  echo
  echo "Setting up cover types Database"
  echo

  # drop the cover types database if it exists
  psql -c "DROP DATABASE IF EXISTS cover_types"

  # create a new cover types database
  psql -c "CREATE DATABASE cover_types"

  # Create the cover types database objects
  psql -d "cover_types" -1 -f "$PROJECT_DIR/services/cover-types/src/main/resources/cover_types.sql"

  # Load the cover types database data
  psql -d "cover_types" -1 -c "\copy cover_type(code, description, version) from \
          '$PROJECT_DIR/data/cover_types.csv' DELIMITER ',' CSV HEADER"

fi


# emission types
# -------------------------------------------------------------------------------------
if [ $EMISSION_TYPES -eq 1 ]; then

  echo
  echo "Setting up emission types Database"
  echo

  # drop the emission types database if it exists
  psql -c "DROP DATABASE IF EXISTS emission_types"

  # create a new emission types database
  psql -c "CREATE DATABASE emission_types"

  # Create the emission types database objects
  psql -d "emission_types" -1 -f "$PROJECT_DIR/services/emission-types/src/main/resources/emission_types.sql"

  # Load the emission types database data
  psql -d "emission_types" -1 -c "\copy emission_type(name, abbreviation, description, version) from \
          '$PROJECT_DIR/data/emission_types.csv' DELIMITER ',' CSV HEADER"

fi


# flux types
# -------------------------------------------------------------------------------------
if [ $FLUX_TYPES -eq 1 ]; then

  echo
  echo "Setting up flux types database"
  echo

  # drop the flux types database if it exists
  psql -c "DROP DATABASE IF EXISTS flux_types"

  # create a new flux types database
  psql -c "CREATE DATABASE flux_types"

  # Create the flux types database objects
  psql -d "flux_types" -1 -f "$PROJECT_DIR/services/flux-types/src/main/resources/flux_types.sql"

  # Load the flux types database data
  psql -d "flux_types" -1 -c "\copy flux_type(name,description,version) from \
          '$PROJECT_DIR/data/flux_types.csv' DELIMITER ',' CSV HEADER"

fi


# fluxes to reporting variables
# ----------------------------------------------------------------------------------
if [ $FLUXES_TO_REPORTING_VARIABLES -eq 1 ]; then

  echo
  echo "Setting up fluxes to reporting variables database"
  echo

  # drop the fluxes to reporting variables database if it exists
  psql -c "DROP DATABASE IF EXISTS fluxes_to_reporting_variables"

  # create a new fluxes to reporting variables database
  psql -c "CREATE DATABASE fluxes_to_reporting_variables"

  # Create the flux to reporting variables database objects
  psql -d "fluxes_to_reporting_variables" -1 -f "$PROJECT_DIR/services/fluxes-to-reporting-variables/src/main/resources/fluxes_to_reporting_variables.sql"

  # Load the fluxes to reporting variables database data

  IFS=","
  while read f1 f2 f3 f4 f5 f6 f7 f8 f9 f10 f11; do
    

    startPoolId=${f1:=null}
    startPoolName=${f2:=null}
    endPoolId=${f3:=null}
    endPoolName=${f4:=null}
    netCarbonStockChangeInLivingBiomas=${f5:=null}
    netCarbonStockChangeInDOM=${f6:=null}
    netCarbonStockChangeInMineralSoils=${f7:=null}
    netCarbonStockChangeInOrganicSoils=${f8:=null}
    ch4=${f9:=null}
    n2o=${f10:=null}
    version=${f11:=null}

    # Create fluxes to reporting variables records
  
    printf '\n%s to %s: %s for net carbon stock change in living biomass\n' "$startPoolName" "$endPoolName" "$netCarbonStockChangeInLivingBiomas"
    psql -d "fluxes_to_reporting_variables" -c "INSERT INTO flux_to_reporting_variable(start_pool_id, end_pool_id, reporting_variable_id, rule, version) VALUES ($startPoolId, $endPoolId, 2, $netCarbonStockChangeInLivingBiomas, $version)"

    printf '\n%s to %s: %s for net carbon stock change in dead organic matter\n' "$startPoolName" "$endPoolName" "$netCarbonStockChangeInDOM"
    psql -d "fluxes_to_reporting_variables" -c "INSERT INTO flux_to_reporting_variable(start_pool_id, end_pool_id, reporting_variable_id, rule, version) VALUES ($startPoolId, $endPoolId, 3, $netCarbonStockChangeInDOM, $version)"

    printf '\n%s to %s: %s for net carbon stock change in mineral soils\n' "$startPoolName" "$endPoolName" "$netCarbonStockChangeInMineralSoils"
    psql -d "fluxes_to_reporting_variables" -c "INSERT INTO flux_to_reporting_variable(start_pool_id, end_pool_id, reporting_variable_id, rule, version) VALUES ($startPoolId, $endPoolId, 4, $netCarbonStockChangeInMineralSoils, $version)"

    printf '\n%s to %s: %s for net carbon stock change in organic soils\n' "$startPoolName" "$endPoolName" "$netCarbonStockChangeInOrganicSoils"
    psql -d "fluxes_to_reporting_variables" -c "INSERT INTO flux_to_reporting_variable(start_pool_id, end_pool_id, reporting_variable_id, rule, version) VALUES ($startPoolId, $endPoolId, 5, $netCarbonStockChangeInOrganicSoils, $version)"

    printf '\n%s to %s: %s for methane\n' "$startPoolName" "$endPoolName" "$ch4"
    psql -d "fluxes_to_reporting_variables" -c "INSERT INTO flux_to_reporting_variable(start_pool_id, end_pool_id, reporting_variable_id, rule, version) VALUES ($startPoolId, $endPoolId, 10, $ch4, $version)"

    printf '\n%s to %s: %s for nitrous Oxide\n' "$startPoolName" "$endPoolName" "$n2o"
    psql -d "fluxes_to_reporting_variables" -c "INSERT INTO flux_to_reporting_variable(start_pool_id, end_pool_id, reporting_variable_id, rule, version) VALUES ($startPoolId, $endPoolId, 11, $n2o, $version)"

  done <$PROJECT_DIR/data/fluxes_to_reporting_variables.csv

fi


# pools
# -------------------------------------------------------------------------------------
if [ $POOLS -eq 1 ]; then

  echo
  echo "Setting up pools database"
  echo

  # drop the pools database if it exists
  psql -c "DROP DATABASE IF EXISTS pools"

  # create a new pools database
  psql -c "CREATE DATABASE pools"

  # Create the pool's database objects
  psql -d "pools" -1 -f "$PROJECT_DIR/services/pools/src/main/resources/pools.sql"

  # Load the pool's database data
  psql -d "pools" -1 -c "\copy pool(name,description,version) from \
          '$PROJECT_DIR/data/pools.csv' DELIMITER ',' CSV HEADER"

fi


# reporting frameworks
# -------------------------------------------------------------------------------------
if [ $REPORTING_FRAMEWORKS -eq 1 ]; then

  echo
  echo "Setting up reporting frameworks database"
  echo

  # drop the reporting frameworks database if it exists
  psql -c "DROP DATABASE IF EXISTS reporting_frameworks"

  # create a new reporting frameworks database
  psql -c "CREATE DATABASE reporting_frameworks"

  # Create the reporting frameworks database objects
  psql -d "reporting_frameworks" -1 -f "$PROJECT_DIR/services/reporting-frameworks/src/main/resources/reporting_frameworks.sql"

  # Load the reporting frameworks database data
  psql -d "reporting_frameworks" -1 -c "\copy reporting_framework(name,description,version) from \
          '$PROJECT_DIR/data/reporting_frameworks.csv' DELIMITER ',' CSV HEADER"

fi


# reporting tables
# -------------------------------------------------------------------------------------
if [ $REPORTING_TABLES -eq 1 ]; then

  echo
  echo "Setting up reporting tables database"
  echo

  # drop the reporting tables database if it exists
  psql -c "DROP DATABASE IF EXISTS reporting_tables"

  # create a new reporting tables database
  psql -c "CREATE DATABASE reporting_tables"

  # Create the reporting tables database objects
  psql -d "reporting_tables" -1 -f "$PROJECT_DIR/services/reporting-tables/src/main/resources/reporting_tables.sql"

  # Load the reporting tables database data
  psql -d "reporting_tables" -1 -c "\copy reporting_table(reporting_framework_id, number, name, description, version) from \
          '$PROJECT_DIR/data/reporting_tables.csv' DELIMITER ',' CSV HEADER"

fi


# reporting variables
# -------------------------------------------------------------------------------------
if [ $REPORTING_VARIABLES -eq 1 ]; then

  echo
  echo "Setting up reporting variables database"
  echo

  # drop the reporting variables database if it exists
  psql -c "DROP DATABASE IF EXISTS reporting_variables"

  # create a new reporting variables database
  psql -c "CREATE DATABASE reporting_variables"

  # Create the reporting variables database objects
  psql -d "reporting_variables" -1 -f "$PROJECT_DIR/services/reporting-variables/src/main/resources/reporting_variables.sql"

  # Load the reporting variables database data
  psql -d "reporting_variables" -1 -c "\copy reporting_variable(reporting_framework_id, name, description, version) from \
          '$PROJECT_DIR/data/reporting_variables.csv' DELIMITER ',' CSV HEADER"

fi


# unit categories
# -------------------------------------------------------------------------------------
if [ $UNIT_CATEGORIES -eq 1 ]; then

  echo
  echo "Setting up unit categories database"
  echo

  # drop the unit categories database if it exists
  psql -c "DROP DATABASE IF EXISTS unit_categories"

  # create a new unit categories database
  psql -c "CREATE DATABASE unit_categories"

  # Create the unit categories database objects
  psql -d "unit_categories" -1 -f "$PROJECT_DIR/services/unit-categories/src/main/resources/unit_categories.sql"

  # Load the unit categories' database data
  psql -d "unit_categories" -1 -c "\copy unit_category(name,version) from \
          '$PROJECT_DIR/data/unit_categories.csv' DELIMITER ',' CSV HEADER"

fi


# units
# -------------------------------------------------------------------------------------
if [ $UNITS -eq 1 ]; then

  echo
  echo "Setting up units database"
  echo

  # drop the units database if it exists
  psql -c "DROP DATABASE IF EXISTS units"

  # create a new units database
  psql -c "CREATE DATABASE units"

  # Create the unit's database objects
  psql -d "units" -1 -f "$PROJECT_DIR/services/units/src/main/resources/units.sql"

  # Load the unit's database data
  psql -d "units" -1 -c "\copy unit(unit_category_id, name, plural, symbol, scale_factor,version) from \
          '$PROJECT_DIR/data/units.csv' DELIMITER ',' CSV HEADER"

fi


echo
echo "Initializing database collections"
echo "---------------------------------------------------------------------------------"
echo


# ----------------------------------------------------------------------------------
# 
# ----------------------------------------------------------------------------------



echo
echo "---------------------------------------------------------------------------------"
echo "Leaving Databases Initialization Script"
echo "---------------------------------------------------------------------------------"
echo
