FROM php:8.1-apache

# Install required system packages and PHP extensions for Laravel + MySQL
RUN apt-get update && apt-get install -y \
    libpng-dev \
    libonig-dev \
    libxml2-dev \
    libsqlite3-dev \
    zip \
    unzip \
    git \
    curl \
    && docker-php-ext-install pdo_mysql pdo_sqlite mbstring exif pcntl bcmath gd opcache \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

# Configure production OPcache for high speed
RUN { \
    echo 'opcache.enable=1'; \
    echo 'opcache.memory_consumption=128'; \
    echo 'opcache.interned_strings_buffer=8'; \
    echo 'opcache.max_accelerated_files=10000'; \
    echo 'opcache.revalidate_freq=2'; \
    echo 'opcache.fast_shutdown=1'; \
    echo 'opcache.enable_cli=0'; \
} > /usr/local/etc/php/conf.d/opcache-recommended.ini

# Enable Apache mod_rewrite, deflate (gzip), expires, and headers for speed
RUN a2enmod rewrite deflate expires headers

# Point Apache document root directly to public/
ENV APACHE_DOCUMENT_ROOT /var/www/html/public
RUN sed -ri -e 's!/var/www/html!${APACHE_DOCUMENT_ROOT}!g' /etc/apache2/sites-available/*.conf
RUN sed -ri -e 's!/var/www/!${APACHE_DOCUMENT_ROOT}!g' /etc/apache2/apache2.conf /etc/apache2/conf-available/*.conf

WORKDIR /var/www/html

# Copy project code
COPY . /var/www/html

# Install Composer dependencies
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer
RUN composer install --no-dev --optimize-autoloader

# Set storage, cache, and database permissions
RUN chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache /var/www/html/database \
    && chmod -R 775 /var/www/html/storage /var/www/html/bootstrap/cache \
    && chmod -R 777 /var/www/html/database

# Generate storage symlink and precompile Blade views
RUN php artisan storage:link || true \
    && php artisan view:cache || true

EXPOSE 80

CMD ["apache2-foreground"]

