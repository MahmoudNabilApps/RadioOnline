FROM azuracast/azuracast_web_v2:latest
EXPOSE 80
CMD ["supervisord", "-c", "/etc/supervisor/supervisord.conf"]
