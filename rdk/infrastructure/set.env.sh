#!/bin/sh

#  set.env.sh
#
#
#  Created by Flowers, Jay on 11/8/12.
#

project_name=rdk

echo -n -e "\033]0;Vistacore-$project_name\007"

vagrant_version="1.4.3"
export VAGRANT_BIN=/usr/bin/vagrant

export TEMP=/tmp
export GRADLE_HOME=/usr/local/gradle/gradle-2.4
export M2_HOME=/usr/local/maven/apache-maven-3.0.4
export GROOVY_HOME=/usr/local/groovy/groovy-2.0.6
export MAVEN_OPTS="-Xmx1G -Xms256m -Djava.awt.headless=true"
export GRADLE_OPTS="-Xmx1G -Xms256m -Dorg.gradle.daemon=true -Dorg.gradle.parallel=true -Dorg.gradle.workers.max=1"
export NPM_CONFIG_REGISTRY="https://store.vistacore.us/nexus/content/repositories/npm-all/"

export CONFIGURE_ARGS="--with-ldflags='-Wno-error=unused-command-line-argument-hard-error-in-future'"

jdk_version="jdk1.8.0_92"

INSTALL_FOR_USER=$USER
if [ ! -z "$SUDO_USER" ]; then
  INSTALL_FOR_USER=$SUDO_USER
fi

INSTALL_IN_HOME="/Users/$INSTALL_FOR_USER"
if [ ! -d $INSTALL_IN_HOME ]; then
  INSTALL_IN_HOME="/home/$INSTALL_FOR_USER"
fi

if [ ! -d $INSTALL_IN_HOME ]; then
  "failure: unable to find home directory for user $INSTALL_FOR_USER"
  exit 1
fi

export WORKSPACE=$INSTALL_IN_HOME/Projects/vistacore
export BERKSHELF_PATH=$WORKSPACE/.berkshelf
export VAGRANT_HOME=$WORKSPACE/.vagrant.d
export GEM_HOME=$WORKSPACE/.aidk_gems
export PROJECT_HOME=$WORKSPACE/rdk
export SLACK_GEM_HOME=$PROJECT_HOME/infrastructure/ruby
export RAKE_SYSTEM=$PROJECT_HOME/.rake

# keep $JAVA_HOME out front to circumvent any previously installed jdks/jres
if uname -a | grep -q "Darwin"; then
  export JAVA_HOME=/Library/Java/JavaVirtualMachines/$jdk_version.jdk/Contents/Home
  export PATH=/usr/local/git/bin:$PATH
else
  export JAVA_HOME=/usr/lib/jvm/$jdk_version
fi

export PATH=$GEM_HOME/bin:$JAVA_HOME/bin:$M2_HOME/bin:$GROOVY_HOME/bin:$GRADLE_HOME/bin:/opt/chefdk/bin:/opt/chefdk/embedded/bin:$PATH
export GEM_PATH=$GEM_HOME:/opt/chefdk/embedded/lib/ruby/gems/2.1.0
export BUNDLE_PATH=$GEM_HOME

function vagrant(){
  (
    $VAGRANT_BIN $@
    echo -n -e "\033]0;Vistacore-$project_name\007"
  )
}

function rake(){
  (
    if [ $1 == "-g" ]; then
      cd $RAKE_SYSTEM
      bundle install --quiet
      bundle exec rake $@
      cd $OLDPWD
    else
      `which rake` $@
    fi
  )
}

export VISTACORE_PROJECT=$project_name
