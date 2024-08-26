import cp from 'child_process';
import ora from 'ora';

const packageInstaller = (modules) => {
    // Modül listesini düzenle
    const moduleList = modules
        .split(',')
        .map(mod => mod.trim())
        .filter(mod => mod !== '--save' && mod !== '--save-dev');
    
    // Yükleme komutunu oluştur
    const installCommand = `npm install ${moduleList.join(' ')} ${modules.includes('--save-dev') ? '--save-dev' : ''}`;

    // Spinner başlat
    const spinner = ora('Installing modules...').start();

    try {
        // Yükleme komutunu çalıştır
        cp.execSync(installCommand, { stdio: 'inherit' });
        spinner.succeed('Modules installed successfully'); // İşlem başarılı olursa spinnerı durdur ve başarılı mesajı göster
    } catch (error) {
        spinner.fail('Failed to install modules'); // Hata olursa spinnerı durdur ve hata mesajı göster
        console.error(error);
    }
};

export default packageInstaller;