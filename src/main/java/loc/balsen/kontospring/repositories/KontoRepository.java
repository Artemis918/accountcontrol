package loc.balsen.kontospring.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import loc.balsen.kontospring.data.Konto;

public interface KontoRepository extends JpaRepository<Konto, Long>{

	List<Konto> findByKontoGruppeId(Integer id);
}
