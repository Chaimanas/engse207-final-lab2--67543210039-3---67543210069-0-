FROM nginx:1.25-alpine
RUN rm /etc/nginx/conf.d/default.conf
COPY nginx.conf /etc/nginx/nginx.conf

# ✅ ต้องมีบรรทัดนี้! เพื่อเอาไฟล์ที่เราเพิ่งสร้างใส่เครื่อง Docker
COPY certs/ /etc/nginx/certs/

EXPOSE 80 443