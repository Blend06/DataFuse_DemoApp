# Use nginx to serve static files
FROM nginx:alpine

# Copy our frontend files to nginx web directory
COPY . /usr/share/nginx/html

# Expose port 80 (nginx default)
EXPOSE 80

# nginx starts automatically with this image