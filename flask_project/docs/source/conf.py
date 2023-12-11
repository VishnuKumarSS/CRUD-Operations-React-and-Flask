# Configuration file for the Sphinx documentation builder.
#
# For the full list of built-in configuration values, see the documentation:
# https://www.sphinx-doc.org/en/master/usage/configuration.html

# -- Project information -----------------------------------------------------
# https://www.sphinx-doc.org/en/master/usage/configuration.html#project-information
import os
import pdb
import sys


sys.path.insert(0, os.path.abspath('../../'))
# Below is the os.path.abspath('../../')
# 'C:\\Coding_Workspace\\PROJECTS\\User-Management-Admin-Dashboard\\flask_project'

project = 'Admin Dashboard - Flask'
copyright = '2023, Vishnu Kumar S S'
author = 'Vishnu Kumar S S'
release = '0.1'

# -- General configuration ---------------------------------------------------
# https://www.sphinx-doc.org/en/master/usage/configuration.html#general-configuration

extensions = [
    'sphinx.ext.autodoc',
    'sphinx.ext.napoleon',
    'sphinx.ext.viewcode',
]


autodoc_decorator_priority = 1 # To detect the functions with Decorators also

templates_path = ['_templates']
exclude_patterns = ['_build', 'Thumbs.db', '.DS_Store']


# -- Options for HTML output -------------------------------------------------
# https://www.sphinx-doc.org/en/master/usage/configuration.html#options-for-html-output

# Default theme
# html_theme = 'alabaster'

# Custom theme
html_theme = 'furo' # Best theme
# html_theme = 'insegel'
# html_theme = 'sphinx_material'
# html_theme = 'sphinx_rtd_theme'

html_static_path = ['_static']
