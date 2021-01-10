FROM phpdockerio/php80-fpm
WORKDIR "/var/www"

# # Fix debconf warnings upon build
ARG DEBIAN_FRONTEND=noninteractive

# # Install selected extensions and other stuff
RUN apt-get update \
    && apt-get -y --no-install-recommends install  php8.0-mysql \
    && apt-get clean; rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/* /usr/share/doc/*


# CMD chmod -R 777 storage bootstrap
# Fix debconf warnings upon build
# ARG DEBIAN_FRONTEND=noninteractive

# # Install selected extensions and other stuff
# RUN apt-get update && sudo apt-get upgrade \
#     # && apt-get -y --no-install-recommends install  php8.0-mysql php8.0-mbstring \
#     && apt-get -y --no-install-recommends install  php8.0-mysql \
#     && apt-get clean; rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/* /usr/share/doc/*

# Add user for laravel application
# RUN groupadd -g 1000 www
# RUN useradd -u 1000 -ms /bin/bash -g www www

# # Copy existing application directory contents
# COPY . /var/www

# # Copy existing application directory permissions
# COPY --chown=www:www . /var/www

# # Change current user to www
# USER www

# # Expose port 9000 and start php-fpm server
# EXPOSE 9000
# CMD ["php-fpm"]