FROM moul/icecast:latest
EXPOSE 8000
CMD ["icecast2", "-c", "/etc/icecast2/icecast.xml"]
