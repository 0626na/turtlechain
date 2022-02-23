# git
DEV_GIT_BRANCH='devel'
TEST_GIT_BRANCH='alpha'
PROD_GIT_BRANCH='prod'

# s3
BUCKET='s3://devel.turtlechain.io'
BUCKET_TEST='s3://alpha.turtlechain.io'
BUCKET_PROD=''

# cloudfront
CLOUDFRONT_DISTRIBUTION_ID='EPXZ6O77AWBK3'
CLOUDFRONT_DISTRIBUTION_ID_TEST='E3376HQ0CGURW4'
CLOUDFRONT_DISTRIBUTION_ID_PROD=''

# iam
export AWS_ACCESS_KEY_ID='AKIATY4RDQNBLGEIDOVW'
export AWS_SECRET_ACCESS_KEY='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'

# env
DEV_ENV='dev'
TEST_ENV='test'
PROD_ENV='production'

# s3 temporary backup
BACKUP_DIR='./.tmp-s3-backup'
TEST_BACKUP_DIR='./.tmp-s3-backup-test'
PROD_BACKUP_DIR='./.tmp-s3-backup-prod'

# default
ENV=$DEV_ENV
GIT_BRANCH=$DEV_GIT_BRANCH
DO_GIT_PULL=true

function check_env() {
  while [[ $# -gt 0 ]]; do
    case $1 in
    --env)
      if [ $2 == $TEST_ENV ]; then
        ENV=$TEST_ENV
        GIT_BRANCH=$TEST_GIT_BRANCH
        BACKUP_DIR=$TEST_BACKUP_DIR
      elif [ $2 == $PROD_ENV ]; then
        ENV=$PROD_ENV
        GIT_BRANCH=$PROD_GIT_BRANCH
        BACKUP_DIR=$PROD_BACKUP_DIR
      fi
      ;;
    --branch)
      GIT_BRANCH=$2
      ;;
    --do-not-pull)
      DO_GIT_PULL=false
      ;;
    esac
    shift
  done

  if [ $ENV == $TEST_ENV ]; then
    BUCKET=$BUCKET_TEST
    CLOUDFRONT_DISTRIBUTION_ID=$CLOUDFRONT_DISTRIBUTION_ID_TEST
  elif [ $ENV == $PROD_ENV ]; then
    BUCKET=$BUCKET_PROD
    CLOUDFRONT_DISTRIBUTION_ID=$CLOUDFRONT_DISTRIBUTION_ID_PROD
  fi

  echo Env : $ENV
  echo s3 bucket : $BUCKET
  echo cloudfront : $CLOUDFRONT_DISTRIBUTION_ID
}

function exit_if_fail() {
  if [ $? -ne 0 ]; then
    echo Error: $1
    kill $TURTLECHAIN_NODE_SERVER_PID
    exit 1
  fi
}

function warning_if_fail() {
  if [ $? -ne 0 ]; then
    echo Warning: $1
  fi
}

function yarn_build() {
  if [ $ENV == 'production' ]; then
    yarn run build:prod
  else
    yarn run build:dev
  fi

  exit_if_fail "yarn build fail."
}

function backup_s3() {
  rm -rf $BACKUP_DIR
  mkdir $BACKUP_DIR
  aws s3 cp $BUCKET $BACKUP_DIR --recursive

  exit_if_fail "Can't not backup s3."
}

function upload_s3_build() {
  aws s3 rm $BUCKET --recursive
  warning_if_fail "Can't not remove old *.js."

  aws s3 cp ./build ${BUCKET} --recursive --grant read=uri=http://acs.amazonaws.com/groups/global/AllUsers
  rollback_if_fail
}

function remove_cache() {
  aws cloudfront create-invalidation --distribution-id $CLOUDFRONT_DISTRIBUTION_ID --paths "/*"
}

function send_deploymail() {
  if [ $ENV == 'production' ]; then
    ./deploymail.py production
  else
    ./deploymail.py
  fi

  exit_if_fail
}

### 1. Check env ###
echo Check env...
check_env $@
echo Env check : OK.

### 2. Yarn build ###
echo Yarn build...
yarn_build
echo build : success.

### 3. S3 Backup ###
echo Backup from $BUCKET to $BACKUP_DIR...
backup_s3
echo Backup : success.

### 4. S3 Upload ###
echo Upload to s3...
upload_s3_build
echo Upload : success.

### 5. Remove cache ###
echo Remove cache...
remove_cache
echo Remove cache: OK.

### 6. Send mail ###
echo Send deploy mail...
send_deploymail
echo Mail OK.

### 7. Deploy complete ###
echo
echo ⭐️ Deploy complete! ⭐️
