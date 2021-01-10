FROM openresty/openresty:1.15.8.1-3-bionic

COPY nginx.conf /usr/local/openresty/nginx/conf

# Automatic Let's Encrypt certificate serving (RSA + ECC) 
RUN /usr/local/openresty/luajit/bin/luarocks install fffonion/lua-resty-acme

# create account key
RUN openssl genpkey -algorithm RSA -pkeyopt rsa_keygen_bits:4096 -out /usr/local/openresty/account.key

# create fallback cert and key
# RUN openssl req -sha256 -new -key server.key -out server.csr -subj '/CN=localhost'
# RUN openssl x509 -req -sha256 -days 365 -in server.csr -signkey server.key -out server.crt
# RUN openssl pkcs12 -export -out cert.pfx -inkey server.key -in server.crt -certfile server.crt -passout pass:1234

RUN openssl req -newkey rsa:2048 -nodes -keyout /usr/local/openresty/default.key -x509 -days 365 -out /usr/local/openresty/default.pem -subj '/CN=localhost'

# example to use this https://gist.github.com/altexy/8f8e08fd13cda25ca47418ab4061ce1b
# COPY test.lua /usr/local/openresty/nginx/test.lua

# COPY required.lua /usr/local/openresty/lualib/required.lua