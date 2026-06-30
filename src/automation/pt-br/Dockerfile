FROM ubuntu:20.04

ENV DEBIAN_FRONTEND=noninteractive

RUN apt-get update && apt-get install -y \
    texlive-latex-base \
    texlive-latex-extra \
    texlive-fonts-recommended \
    texlive-fonts-extra \
    texlive-xetex \
    latexmk \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# COPY ./ ./

CMD /bin/bash -c "latexmk -pdf -interaction=nonstopmode -output-directory=./ ./resume.tex && latexmk -c -output-directory=./ ./resume.tex"