FROM python:3.11-slim

WORKDIR /usr/src/service

# Accept build argument for GitLab token
ARG GITLAB_PYPI_TOKEN

# Configure pip to use GitLab package registry
RUN pip config set global.index-url https://pypi.org/simple && \
    pip config set global.extra-index-url https://gitlab-ci-token:${GITLAB_PYPI_TOKEN}@gitlab.awenet.be/api/v4/projects/84/packages/pypi/simple

# Install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY . .

# Expose port
EXPOSE 5000

# Run application
CMD ["python", "main.py"]